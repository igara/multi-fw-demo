# Next.js における Shadow DOM を使った複数フレームワークの統合

## 概要

このプロジェクトでは、Next.js アプリケーション内で Shadow DOM を利用して、Vue2 と React の別々のアプリケーションを独立して動作させています。これにより、各フレームワークのスタイルやスクリプトが互いに干渉することなく、同一ページ内で共存できます。

## 実装箇所

### メインページ: `packages/nextjs/app/multi/page.tsx`

```tsx
export default function MultiPage() {
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-8">Multi Framework Demo - Shadow DOM</h1>

      <div className="space-y-8">
        <section>
          <h2 className="text-xl font-semibold mb-4">Vue2 App in Shadow DOM</h2>
          <Vue2AppLoader />
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-4">Next.js App</h2>
          <ShadcnButton />
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-4">React App in Shadow DOM</h2>
          <ReactAppLoader />
        </section>
      </div>
    </div>
  );
}
```

このページでは、3つの異なるフレームワークのコンポーネントを配置しています：
1. **Vue2AppLoader**: Shadow DOM 内で Vue2 アプリを実行
2. **ShadcnButton**: Next.js ネイティブコンポーネント
3. **ReactAppLoader**: Shadow DOM 内で React アプリを実行

## Shadow DOM 実装の詳細

### 1. Vue2AppLoader (`packages/nextjs/app/multi/components/Vue2AppLoader.tsx`)

#### 主要な処理フロー

1. **Shadow Root の作成**
   ```tsx
   const shadowRoot = containerRef.current.attachShadow({ mode: "open" });
   shadowRootRef.current = shadowRoot;
   ```
   - `attachShadow({ mode: "open" })` で Shadow DOM を作成
   - `mode: "open"` により JavaScript からアクセス可能な Shadow Root を生成

2. **アプリケーションコンテナの準備**
   ```tsx
   const appContainer = document.createElement("div");
   appContainer.id = "vue2-app";
   shadowRoot.appendChild(appContainer);
   ```
   - Vue2 アプリをマウントするための専用コンテナを Shadow Root 内に作成

3. **スタイルの読み込みと適用**
   ```tsx
   const cssResponse = await fetch(cssPath);
   const cssText = await cssResponse.text();
   
   // @property定義を抽出
   const propertyRegex = /@property\s+[^{]+\{[^}]+\}/g;
   const properties = cssText.match(propertyRegex) || [];
   
   if (properties.length > 0) {
     const propertySheet = new CSSStyleSheet();
     await propertySheet.replace(properties.join("\n"));
     shadowRoot.adoptedStyleSheets = [propertySheet];
   }
   
   // ShadowRoot内にスタイルを適用
   const shadowStyle = document.createElement("style");
   shadowStyle.textContent = cssText;
   shadowRoot.appendChild(shadowStyle);
   ```
   - 外部 CSS ファイルを fetch で取得
   - CSS カスタムプロパティ（`@property`）を抽出して `adoptedStyleSheets` で登録
   - 残りのスタイルを `<style>` タグとして Shadow Root に追加
   - これにより、Vue2 アプリのスタイルが Shadow DOM 内に隔離される

4. **スクリプトの読み込みとアプリのマウント**
   ```tsx
   const script = document.createElement("script");
   script.type = "module";
   script.src = scriptPath;
   
   script.onload = () => {
     const checkAndMount = () => {
       if (typeof window.mountVue2App === "function") {
         window.mountVue2App(appContainer);
         setIsLoading(false);
       } else {
         setTimeout(checkAndMount, 100);
       }
     };
     checkAndMount();
   };
   
   document.body.appendChild(script);
   ```
   - Vue2 アプリのバンドルされた JavaScript を動的に読み込み
   - グローバル関数 `window.mountVue2App` が利用可能になるまでポーリング
   - 関数が利用可能になったら、Shadow Root 内のコンテナにアプリをマウント

5. **クリーンアップ**
   ```tsx
   return () => {
     if (shadowRootRef.current) {
       shadowRootRef.current.innerHTML = "";
       shadowRootRef.current = null;
     }
   };
   ```
   - コンポーネントのアンマウント時に Shadow Root の内容をクリア
   - メモリリークを防止

### 2. ReactAppLoader (`packages/nextjs/app/multi/components/ReactAppLoader.tsx`)

ReactAppLoader も Vue2AppLoader と同様の実装パターンを採用していますが、以下の点が異なります：

- **マウント関数**: `window.mountReactApp` を使用
- **コンテナ ID**: `react-app` を使用
- **パス**: React アプリの成果物パスを参照

処理フローは Vue2AppLoader とほぼ同じです：
1. Shadow Root の作成
2. アプリケーションコンテナの準備
3. スタイルの読み込みと適用（@property 処理を含む）
4. スクリプトの読み込みとアプリのマウント
5. クリーンアップ

## Shadow DOM を使用する利点

### 1. スタイルの隔離
- 各フレームワークの CSS が他のフレームワークやホストアプリケーション（Next.js）のスタイルに影響を与えない
- グローバル CSS のリセットやフレームワーク固有のスタイルが衝突しない

### 2. JavaScript スコープの分離
- 各アプリケーションは独自の DOM ツリーを持つため、DOM クエリが他のアプリケーションに影響しない
- `getElementById` や `querySelector` などが Shadow Root 内で完結

### 3. マイクロフロントエンドアーキテクチャの実現
- 異なるフレームワークで開発されたアプリケーションを、一つのページ内で統合可能
- 各チームが独立してアプリケーションを開発・デプロイできる

### 4. カプセル化
- 実装の詳細が外部から隠蔽され、より保守性の高いコードになる
- 各アプリケーションは明確な境界を持つ

## 技術的な注意点

### 1. @property の処理
CSS カスタムプロパティ（`@property`）は Shadow DOM 内だけでなく、グローバルにも登録する必要があります。これは、一部のブラウザやフレームワークで適切に動作させるためです。

```tsx
if (!win.__vue2AppPropsInjected) {
  win.__vue2AppPropsInjected = true;
  if (document.adoptedStyleSheets) {
    const globalPropSheet = new CSSStyleSheet();
    await globalPropSheet.replace(properties.join("\n"));
    document.adoptedStyleSheets = [...document.adoptedStyleSheets, globalPropSheet];
  }
}
```

### 2. グローバルマウント関数
各アプリケーションは、ビルド時にグローバルなマウント関数（`window.mountVue2App`、`window.mountReactApp`）をエクスポートする必要があります。

### 3. 非同期読み込み
スタイルとスクリプトは非同期に読み込まれるため、適切なローディング状態とエラーハンドリングが必要です。

### 4. Shadow DOM のブラウザサポート
Shadow DOM は現代のブラウザでサポートされていますが、古いブラウザではポリフィルが必要な場合があります。

## まとめ

このアーキテクチャにより、Next.js、Vue2、React という3つの異なるフレームワークを同一ページ内で共存させることができます。Shadow DOM を活用することで、各フレームワークのスタイルとスクリプトが隔離され、互いに干渉することなく動作します。これは、レガシーアプリケーションの段階的な移行や、マイクロフロントエンドアーキテクチャの実装において非常に有用なパターンです。
