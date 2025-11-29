# multi-fw-demo

いろんなFWを雑に使ってみる

## ディレクトリ構成

このプロジェクトはpnpm workspacesを使用したモノレポ構成になっています。

```
multi-fw-demo/
├── packages/
│   ├── shadcn/          # Shadcn UIコンポーネントライブラリ
│   │                    # Vite + React + TypeScript + Storybook
│   │                    # 再利用可能なUIコンポーネントを提供
│   ├── nextjs/          # Next.jsアプリケーション
│   │                    # Next.js 16 + React 19 + TypeScript
│   ├── react/           # Reactアプリケーション
│   │                    # Vite + React 18 + TanStack Router
│   └── vue2/            # Vue.js 2アプリケーション
│                        # Vite + Vue 2.7 + TypeScript
├── docs/                # プロジェクトドキュメント
│   ├── CODE_WORKSPACE.md
│   └── GITHUB_WORKFLOW/ # GitHub Actions関連のドキュメント
├── _site/               # ビルド成果物の配置先（GitHub Pages用）
├── index.html           # ルートのHTMLファイル
└── pnpm-workspace.yaml  # pnpm workspaces設定
```

### パッケージ詳細

- **shadcn** (`@multi-fw-demo-igarashi/shadcn`)
  - Shadcn UIベースのコンポーネントライブラリ
  - Storybookでコンポーネントカタログを提供（ポート6101）
  - npm公開可能な形式でビルド
  - Biome + ESLint + Oxlintによるコード品質管理

- **nextjs**
  - Next.jsを使用したフロントエンドアプリケーション
  - ポート3101で起動
  - React 19とNext.js 16を使用
  - Biome + ESLint + Oxlintによるコード品質管理

- **react** (`@multi-fw-demo/react`)
  - Vite + React 18を使用したSPAアプリケーション
  - TanStack Routerによるルーティング
  - shadcnコンポーネントライブラリを使用
  - Biome + ESLint + Oxlintによるコード品質管理

- **vue2** (`@multi-fw-demo/vue2`)
  - Vue.js 2.7を使用したアプリケーション
  - Vite + Vue Routerによる構成
  - TypeScript対応
  - ESLintによるコード品質管理

## How to use

```bash
mise install
pnpm install
pnpm dev
```

## 利用可能なコマンド

```bash
# 開発サーバー起動 (shadcn Storybook + Next.js)
pnpm dev

# 各パッケージの開発サーバー個別起動
pnpm --filter shadcn dev      # Storybookのみ (watch mode)
pnpm --filter nextjs dev       # Next.jsのみ (ポート3000)
pnpm --filter react dev        # Reactアプリ (Vite)
pnpm --filter vue2 dev         # Vue2アプリ (Vite)

# Storybookのみ起動 (ポート6101)
pnpm storybook

# ビルド (全パッケージ)
pnpm build

# 各パッケージの個別ビルド
pnpm --filter shadcn build           # コンポーネントライブラリ
pnpm --filter nextjs build           # Next.js静的エクスポート
pnpm --filter react build            # React SPAビルド
pnpm --filter vue2 build             # Vue2ビルド

# Storybookビルド
pnpm build-storybook

# サイトプレビュー (ローカルHTTPサーバー + ファイル監視)
pnpm watch:site  # ポート8080でサイト起動、変更を自動同期

# リント
pnpm lint        # チェックのみ (全パッケージ)
pnpm lint:fix    # 自動修正 (全パッケージ)

# フォーマット
pnpm format      # チェックのみ (全パッケージ)
pnpm format:fix  # 自動修正 (全パッケージ)
```
