"use client";

import { useEffect, useRef, useState } from "react";

export function ReactCounterLoader() {
  const cssPath = "/multi-fw-demo/react/assets/index.css";
  const scriptPath = "/multi-fw-demo/react/assets/index.js";
  const containerRef = useRef<HTMLDivElement>(null);
  const shadowRootRef = useRef<ShadowRoot | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!containerRef.current || shadowRootRef.current) return;

    // ShadowRootを作成
    const shadowRoot = containerRef.current.attachShadow({ mode: "open" });
    shadowRootRef.current = shadowRoot;

    // Reactアプリのコンテナを作成
    const appContainer = document.createElement("div");
    appContainer.id = "react-app";
    shadowRoot.appendChild(appContainer);

    const initializeReactApp = async () => {
      try {
        // スタイルを読み込む
        const cssResponse = await fetch(cssPath);
        if (cssResponse.ok) {
          const cssText = await cssResponse.text();

          // @property定義を抽出
          const propertyRegex = /@property\s+[^{]+\{[^}]+\}/g;
          const properties = cssText.match(propertyRegex) || [];

          // @property定義があればadoptedStyleSheetsで登録
          if (properties.length > 0) {
            const propertySheet = new CSSStyleSheet();
            await propertySheet.replace(properties.join("\n"));
            shadowRoot.adoptedStyleSheets = [propertySheet];

            // document全体にも@propertyを適用（グローバル登録）
            try {
              const win = window as typeof window & {
                __reactCounterPropsInjected?: boolean;
              };
              if (!win.__reactCounterPropsInjected) {
                win.__reactCounterPropsInjected = true;
                if (document.adoptedStyleSheets) {
                  const globalPropSheet = new CSSStyleSheet();
                  await globalPropSheet.replace(properties.join("\n"));
                  document.adoptedStyleSheets = [...document.adoptedStyleSheets, globalPropSheet];
                }
              }
            } catch (e) {
              console.warn("@property のグローバル登録に失敗しました", e);
            }
          }

          // ShadowRoot内にスタイルを適用
          const shadowStyle = document.createElement("style");
          shadowStyle.textContent = cssText;
          shadowRoot.appendChild(shadowStyle);
        }

        // Reactのスクリプトを読み込む
        const script = document.createElement("script");
        script.type = "module";
        script.src = scriptPath;

        script.onload = () => {
          // window.mountReactCounterAppが利用可能になるまで待つ
          const checkAndMount = () => {
            if (typeof window.mountReactCounterApp === "function") {
              try {
                window.mountReactCounterApp(appContainer);
                setIsLoading(false);
              } catch (err) {
                console.error("Failed to mount React counter app:", err);
                setError("Reactカウンターアプリのマウントに失敗しました");
                setIsLoading(false);
              }
            } else {
              setTimeout(checkAndMount, 100);
            }
          };
          checkAndMount();
        };

        script.onerror = () => {
          setError("Reactスクリプトの読み込みに失敗しました");
          setIsLoading(false);
        };

        document.body.appendChild(script);
      } catch (err) {
        console.error("Failed to initialize React counter app:", err);
        setError("Reactカウンターアプリの初期化に失敗しました");
        setIsLoading(false);
      }
    };

    initializeReactApp();

    return () => {
      if (shadowRootRef.current) {
        shadowRootRef.current.innerHTML = "";
      }
    };
  }, []);

  return (
    <div className="border rounded-lg p-4 bg-white shadow-lg">
      {isLoading && (
        <div className="text-center py-8">
          <p>Reactアプリを読み込み中...</p>
        </div>
      )}
      {error && (
        <div className="text-center py-8 text-red-600">
          <p>{error}</p>
        </div>
      )}
      <div ref={containerRef} className="min-h-[400px]" />
    </div>
  );
}

// グローバル型定義
declare global {
  interface Window {
    mountReactCounterApp: (container: HTMLElement) => void;
  }
}
