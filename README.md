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
│   └── nextjs/          # Next.jsアプリケーション
│                        # Next.js 16 + React 19 + TypeScript
├── docs/                # プロジェクトドキュメント
│   ├── CODE_WORKSPACE.md
│   └── GITHUB_WORKFLOW/ # GitHub Actions関連のドキュメント
├── index.html           # ルートのHTMLファイル
└── pnpm-workspace.yaml  # pnpm workspaces設定
```

### パッケージ詳細

- **shadcn** (`@multi-fw-demo-igarashi/shadcn`)
  - Shadcn UIベースのコンポーネントライブラリ
  - Storybookでコンポーネントカタログを提供
  - npm公開可能な形式でビルド

- **nextjs**
  - Next.jsを使用したフロントエンドアプリケーション
  - ポート3101で起動
  - Biome + ESLint + Oxlintによるコード品質管理

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

# Storybookのみ起動 (ポート6101)
pnpm storybook

# ビルド (全パッケージ)
pnpm build

# Storybookビルド
pnpm build-storybook

# サイトプレビュー (ローカルHTTPサーバー + ファイル監視)
pnpm watch:site  # ポート8080でサイト起動、変更を自動同期

# リント
pnpm lint        # チェックのみ
pnpm lint:fix    # 自動修正

# フォーマット
pnpm format      # チェックのみ
pnpm format:fix  # 自動修正
```
