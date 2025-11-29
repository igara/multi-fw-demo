# oxlint + Biome + ESLint 統合リント設定

## 🎯 目的

- **oxlint**: TypeScript/JavaScript一般リント（超高速）
- **Biome**: フォーマット、スタイルリント、インポート整理
- **ESLint (better-tailwindcss)**: Tailwind CSS特有のクラス名検証

## ✅ 導入済みパッケージ

```json
{
  "devDependencies": {
    "@biomejs/biome": "^2.3.8",
    "@typescript-eslint/parser": "^8.48.0",
    "eslint": "^9.39.1",
    "eslint-plugin-better-tailwindcss": "^3.7.11",
    "oxlint": "^1.30.0"
  }
}
```

## 📝 設定ファイル

### 1. `biome.json`
- フォーマット設定（インデント: 2スペース、行幅: 100）
- 一般的なリントルール（アクセシビリティ、複雑度など）
- インポート自動整理
- Tailwind CSSディレクティブのサポート（`css.parser.tailwindDirectives: true`）

### 2. `eslint.config.mjs`
- **Tailwind CSS検証のみ**に特化
- TypeScriptパーサー（`@typescript-eslint/parser`）使用
- 有効なルール:
  - `no-unregistered-classes`: Tailwindに登録されていないクラスを検出
  - `no-conflicting-classes`: 競合するクラスを検出（例: `p-2 p-3`）
  - `no-deprecated-classes`: 非推奨クラスの警告
- フォーマット関連のルールは全て無効化（Biomeに任せる）
- Tailwind CSS v4用に`entryPoint: "src/styles/globals.css"`を設定

### 3. `.vscode/settings.json`
oxlint、Biome、ESLintが協調動作する設定:

```json
{
  "eslint.enable": true,
  "editor.defaultFormatter": "biomejs.biome",
  "editor.formatOnSave": true,
  "editor.codeActionsOnSave": {
    "source.organizeImports.biome": "explicit",
    "source.fixAll.biome": "explicit",
    "source.fixAll.eslint": "explicit"
  }
}
```

**保存時の動作順序**:
1. Biomeがフォーマット実行
2. Biomeがインポート整理
3. Biomeが自動修正
4. ESLintがTailwind検証と自動修正

## 🚀 使用方法

### コマンド

```bash
# 統合チェック（oxlint + Biome + ESLint）
pnpm lint

# 個別実行
pnpm lint:biome      # Biomeのみ
pnpm lint:oxlint     # oxlintのみ（超高速: ~33ms）
pnpm lint:eslint     # ESLintのみ（Tailwind検証）

# 自動修正
pnpm lint:fix        # Biome + ESLint自動修正

# 包括的なチェックと修正
pnpm check           # oxlint + Biome + ESLint全て実行
```

### VS Code拡張機能

推奨拡張機能（`.vscode/extensions.json`）:
- `biomejs.biome` - Biome（フォーマット・リント）
- `dbaeumer.vscode-eslint` - ESLint（Tailwind検証）
- `bradlc.vscode-tailwindcss` - Tailwind CSS IntelliSense
- `csstools.postcss` - PostCSS

## ✨ 機能分担

### oxlintが担当
- ⚡ TypeScript/JavaScriptの一般的なリント
- ⚡ **超高速実行**（13ファイル・89ルールを33msで処理）
- ⚡ ESLintと比較して数十倍高速
- ⚡ Rust製で並列処理に最適化

### Biomeが担当
- ✅ コードフォーマット（JavaScript/TypeScript/JSX/TSX/JSON/CSS）
- ✅ スタイルリント（セミコロン、クォート、インデントなど）
- ✅ インポート自動整理
- ✅ アクセシビリティチェック
- ✅ React Hooks依存関係チェック
- ✅ 高速実行（Rust製）

### ESLintが担当
- 🎨 **Tailwindに存在しないクラスの検出**
- 🎨 **競合するクラスの検出** (例: `p-2 p-3`、`text-red-500 text-blue-500`)
- 🎨 **非推奨クラスの警告**
- 🎨 Tailwind CSS v4の@theme、@custom-variantなどをサポート

## 🎨 実例

### 検出される問題例

```tsx
// ❌ ESLintが検出（Tailwind検証）
<div className="non-existent-class" />
// Error: Class 'non-existent-class' is not registered with Tailwind CSS

// ❌ ESLintが検出（競合クラス）
<div className="p-2 p-3" />
// Error: 'p-2' applies the same CSS properties as 'p-3'

// ❌ oxlintが検出（TypeScript一般）
const unused = 123; // Warning: unused variable

// ✅ Biomeが自動整形
import * as React from "react"
import { Button } from "./button"
// ↓ 保存時に自動でアルファベット順に整列
import { Button } from "./button";
import type * as React from "react";
```

## 🔄 CI/CDでの実行フロー

```bash
pnpm lint
```

実行順序:
1. **oxlint実行** (~33ms) - 一般的なTypeScript/JavaScriptエラーを高速チェック
2. **Biome実行** (~数百ms) - フォーマット・スタイルチェック
3. **ESLint実行** (~数秒) - Tailwindクラス検証

すべて成功してビルドに進む。

## 💡 Tips

- **競合なし**: 3つのツールは異なる責任範囲を持つため競合しません
- **段階的チェック**: oxlintで高速に基本エラーを検出し、その後詳細チェック
- **エディタ統合**: VS Codeで保存するだけで全て自動実行
- **高速CI**: oxlintの導入により、CIの実行時間が大幅短縮
- **型チェックなし**: `@typescript-eslint/parser`は構文解析のみで型チェックは行わない（軽量）

## 🐛 トラブルシューティング

### ESLintがTailwind設定を読めない場合

`eslint.config.mjs`の`entryPoint`がCSSファイルを正しく指しているか確認:
```js
settings: {
  "better-tailwindcss": {
    entryPoint: "src/styles/globals.css", // Tailwind CSS v4
  }
}
```

### TypeScript構文エラーが出る場合

`@typescript-eslint/parser`が正しくインポートされているか確認:
```js
import tsParser from "@typescript-eslint/parser";

export default [
  {
    languageOptions: {
      parser: tsParser,
      // ...
    }
  }
];
```

### VS Codeで自動修正が動作しない場合

1. 必要な拡張機能がすべてインストールされているか確認
   - Biome extension
   - ESLint extension
2. VS Codeをリロード（`Cmd+Shift+P` → "Reload Window"）
3. `.vscode/settings.json`の設定を確認

### oxlintが遅い場合

oxlintはデフォルトで並列処理を行いますが、設定で調整可能:
```bash
oxlint --threads 8  # スレッド数を指定
```

## 📊 パフォーマンス比較

| ツール | 対象 | 実行時間（目安） | 特徴 |
|--------|------|------------------|------|
| oxlint | TS/JS | ~33ms | 超高速、並列処理 |
| Biome | 全ファイル | ~数百ms | 高速、Rust製 |
| ESLint | TS/JS/JSX/TSX | ~数秒 | Tailwind検証に必須 |

**合計実行時間**: 数秒程度（従来のESLint単体より高速）
