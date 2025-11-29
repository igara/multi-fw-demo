# @multi-fw-demo-igarashi/shadcn

## 概要

shadcn/uiをベースとしたReact UIコンポーネントライブラリパッケージです。再利用可能なコンポーネントを提供し、複数のフレームワークで利用できるようにビルドされています。

## 特徴

- **Radix UI ベース**: アクセシブルなプリミティブコンポーネントを使用
- **Tailwind CSS**: ユーティリティファーストなスタイリング
- **TypeScript**: 型安全なコンポーネント開発
- **Storybook**: コンポーネントの開発とドキュメント化
- **Vite ビルド**: 高速なビルドとバンドル最適化

## ディレクトリ構成

```
packages/shadcn/
├── src/
│   ├── components/
│   │   └── ui/          # UIコンポーネント (Button, Card, Dialog など)
│   ├── lib/             # ユーティリティ関数
│   └── styles/          # グローバルスタイル
├── docs/                # ドキュメント
├── storybook-static/    # ビルド済みStorybook
├── biome.json          # Biomeの設定
├── components.json     # shadcn/ui CLI設定
├── vite.config.ts      # Viteビルド設定
└── package.json        # パッケージ情報

```

## 主要なコンポーネント

- **Button**: ボタンコンポーネント (複数のバリアント対応)
- **Card**: カードレイアウトコンポーネント
- **Dialog**: モーダルダイアログコンポーネント

## スクリプト

```bash
# 開発モード (ウォッチモード)
pnpm dev

# ビルド
pnpm build

# Storybook起動
pnpm storybook

# Storybookビルド
pnpm build-storybook

# リント実行
pnpm lint

# リント自動修正
pnpm lint:fix

# フォーマット
pnpm format:fix

# 全チェック (リント + フォーマット)
pnpm check
```

## エクスポート

このパッケージは以下をエクスポートしています:

- コンポーネント: `import { Button, Card, Dialog } from '@multi-fw-demo-igarashi/shadcn'`
- スタイル: `import '@multi-fw-demo-igarashi/shadcn/styles'`

## 使用技術

- **React**: UIライブラリ
- **Radix UI**: アクセシブルなコンポーネントプリミティブ
- **Tailwind CSS v4**: スタイリングフレームワーク
- **TypeScript**: 型システム
- **Vite**: ビルドツール
- **Storybook**: コンポーネントカタログ
- **Biome / ESLint / oxlint**: コード品質管理
