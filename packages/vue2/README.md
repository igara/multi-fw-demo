# Vue 2 Project

Vue 2とVite、TypeScriptで構築されたモダンな開発環境です。

## 技術スタック

- **Vue 2.7.16** - プログレッシブJavaScriptフレームワーク
- **Vite 5** - 高速ビルドツール
- **TypeScript** - 型安全性を提供
- **ESLint** - コード品質とスタイルのチェック

## セットアップ

### 依存関係のインストール

```bash
pnpm install
```

### 開発サーバーの起動

```bash
pnpm dev
```

開発サーバーは http://localhost:5174 で起動します。

### プロダクションビルド

```bash
pnpm build
```

### ビルドしたファイルのプレビュー

```bash
pnpm preview
```

### Lint実行

```bash
pnpm lint
```

### Lint自動修正

```bash
pnpm lint:fix
```

## プロジェクト構造

```
packages/vue2/
├── src/
│   ├── components/      # Vueコンポーネント
│   ├── App.vue         # ルートコンポーネント
│   ├── main.ts         # エントリーポイント
│   └── shims-vue.d.ts  # Vue型定義
├── public/             # 静的ファイル
├── index.html          # HTMLエントリーポイント
├── vite.config.ts      # Vite設定
├── tsconfig.json       # TypeScript設定
└── package.json
```

## 特徴

- ⚡️ Viteによる高速な開発体験
- 🔥 ホットモジュール置換(HMR)
- 📦 TypeScriptによる型安全性
- 🎨 Vue 2.7のComposition API対応
- 🔍 ESLintによるコード品質管理

## モノレポ構成

このプロジェクトは`multi-fw-demo`モノレポの一部です。pnpmワークスペースを使用して管理されています。
