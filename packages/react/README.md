# React SPA

TanStack Routerを使用したReact SPAアプリケーションです。

## 特徴

- ⚡️ Vite - 高速なビルドツール
- ⚛️ React 18 - 最新のReact
- 🚦 TanStack Router - 型安全なルーティング
- 📝 TypeScript - 型安全な開発
- 🎨 ESLint + Biome - コード品質とフォーマット

## セットアップ

```bash
# 依存関係のインストール
pnpm install

# 開発サーバーの起動
pnpm dev

# ビルド
pnpm build

# プレビュー
pnpm preview

# Lint
pnpm lint
pnpm lint:fix
```

## ディレクトリ構造

```
packages/react/
├── src/
│   ├── routes/          # TanStack Routerのルート定義
│   │   ├── __root.tsx   # ルートレイアウト
│   │   ├── index.tsx    # トップページ
│   │   └── about.tsx    # アバウトページ
│   ├── main.tsx         # アプリケーションエントリーポイント
│   └── index.css        # グローバルスタイル
├── public/              # 静的ファイル
├── index.html           # HTMLテンプレート
└── vite.config.ts       # Vite設定
```

## TanStack Router

このプロジェクトでは、TanStack Routerを使用しています。TanStack Routerは以下の特徴があります:

- 完全な型安全性
- 自動的なコード分割
- ファイルベースのルーティング
- 優れた開発者体験

ルートは`src/routes/`ディレクトリに配置されます。ルートツリーは自動生成されます。

## 開発

開発サーバーを起動すると、`http://localhost:5173`でアプリケーションにアクセスできます。

ファイルを編集すると、HMR（Hot Module Replacement）により即座に反映されます。
