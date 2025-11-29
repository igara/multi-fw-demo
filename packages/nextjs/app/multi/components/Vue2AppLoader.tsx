"use client";

import { useEffect, useRef, useState } from "react";

export function Vue2AppLoader() {
  const cssPath = "/multi-fw-demo/vue2/assets/index.css";
  const scriptPath = "/multi-fw-demo/vue2/assets/index.js";
  const containerRef = useRef<HTMLDivElement>(null);
  const shadowRootRef = useRef<ShadowRoot | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!containerRef.current || shadowRootRef.current) return;

    // ShadowRootを作成
    const shadowRoot = containerRef.current.attachShadow({ mode: "open" });
    shadowRootRef.current = shadowRoot;

    // Vue2アプリのコンテナを作成
    const appContainer = document.createElement("div");
    appContainer.id = "vue2-app";
    shadowRoot.appendChild(appContainer);

    const initializeVue2App = async () => {
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
                __vue2AppPropsInjected?: boolean;
              };
              if (!win.__vue2AppPropsInjected) {
                win.__vue2AppPropsInjected = true;
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

        // Vue2のスクリプトを読み込む
        const script = document.createElement("script");
        script.type = "module";
        script.src = scriptPath;

        script.onload = () => {
          // window.mountVue2Appが利用可能になるまで待つ
          const checkAndMount = () => {
            if (typeof window.mountVue2App === "function") {
              try {
                window.mountVue2App(appContainer);
                setIsLoading(false);
              } catch (err) {
                console.error("Failed to mount Vue2 app:", err);
                setError("Vue2アプリのマウントに失敗しました");
                setIsLoading(false);
              }
            } else {
              setTimeout(checkAndMount, 100);
            }
          };
          checkAndMount();
        };

        script.onerror = () => {
          setError("Vue2スクリプトの読み込みに失敗しました");
          setIsLoading(false);
        };

        document.body.appendChild(script);
      } catch (err) {
        console.error("Failed to initialize Vue2 app:", err);
        setError("Vue2アプリの初期化に失敗しました");
        setIsLoading(false);
      }
    };

    initializeVue2App();

    return () => {
      // クリーンアップ
      if (shadowRootRef.current) {
        shadowRootRef.current.innerHTML = "";
        shadowRootRef.current = null;
      }
    };
  }, []);

  return (
    <div className="border rounded-lg p-4 bg-white shadow-lg">
      {isLoading && (
        <div className="text-center py-8">
          <p>Vue2アプリを読み込み中...</p>
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

declare global {
  interface Window {
    mountVue2App: (container: HTMLElement) => void;
  }
}
