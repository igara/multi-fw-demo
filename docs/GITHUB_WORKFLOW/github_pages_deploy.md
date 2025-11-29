# .github/workflows/github_pages_deploy.yml

## 概要

このワークフローは、Next.jsアプリケーションとStorybookをビルドし、GitHub Pagesにデプロイするための自動化設定です。

## トリガー条件

- **push**: `main`ブランチへのプッシュ時に自動実行
- **workflow_dispatch**: 手動実行も可能

## 権限設定

```yaml
permissions:
  contents: read      # リポジトリの内容を読み取り
  pages: write        # GitHub Pagesへの書き込み
  id-token: write     # OIDC トークンの発行
```

## 並行実行制御

```yaml
concurrency:
  group: "pages"
  cancel-in-progress: false
```

同時に複数のデプロイが実行されないように制御しています。

## ジョブ構成

### 1. buildジョブ

Next.jsとStorybookをビルドし、デプロイ用のアーティファクトを作成します。

#### ステップ詳細

##### 1.1 リポジトリのチェックアウト

```yaml
- name: Checkout
  uses: actions/checkout@v6
```

リポジトリのコードをワークフロー環境にクローンします。

##### 1.2 pnpmのセットアップ

```yaml
- name: Setup pnpm
  uses: pnpm/action-setup@v4
  with:
    run_install: false
    version: 10.23.0
```

パッケージマネージャーpnpm（バージョン10.23.0）をインストールします。`run_install: false`により、この段階では依存関係をインストールしません。

##### 1.3 Node.jsのセットアップ

```yaml
- name: Setup Node.js
  uses: actions/setup-node@v6
  with:
    node-version-file: './package.json'
    cache: 'pnpm'
    cache-dependency-path: pnpm-lock.yaml
```

- `package.json`で指定されたNode.jsバージョンをセットアップ
- pnpmのキャッシュを有効化してビルド時間を短縮

##### 1.4 依存関係のインストール

```yaml
- name: Install dependencies
  run: pnpm install --frozen-lockfile
```

`pnpm-lock.yaml`に基づいて依存関係をインストールします。`--frozen-lockfile`オプションにより、ロックファイルが更新されないことを保証します。

##### 1.5 Next.jsのビルド

```yaml
- name: Build Next.js
  run: pnpm build
```

Next.jsアプリケーションを本番用にビルドします。

##### 1.6 Storybookのビルド

```yaml
- name: Build Storybook
  run: pnpm build-storybook
```

Storybookを静的サイトとしてビルドします。

##### 1.7 デプロイディレクトリの準備

```yaml
- name: Prepare deployment directory
  run: |
    mkdir -p _site
    cp index.html _site/
    cp -r packages/nextjs/out _site/nextjs
    cp -r packages/shadcn/storybook-static _site/shadcn
```

デプロイ用のディレクトリ構造を作成します：

- `_site/` - デプロイのルートディレクトリ
- `_site/index.html` - トップページ
- `_site/nextjs/` - Next.jsのビルド出力
- `_site/shadcn/` - Storybookのビルド出力

##### 1.8 GitHub Pagesの設定

```yaml
- name: Setup Pages
  uses: actions/configure-pages@v5
```

GitHub Pages用の環境を構成します。

##### 1.9 アーティファクトのアップロード

```yaml
- name: Upload artifact
  uses: actions/upload-pages-artifact@v4
  with:
    path: ./_site
```

ビルドされた`_site`ディレクトリをアーティファクトとしてアップロードし、deployジョブで使用できるようにします。

### 2. deployジョブ

ビルドされたアーティファクトをGitHub Pagesにデプロイします。

```yaml
deploy:
  environment:
    name: github-pages
    url: ${{ steps.deployment.outputs.page_url }}
  runs-on: ubuntu-latest
  needs: build
```

- `needs: build` - buildジョブが成功した後に実行
- `environment: github-pages` - GitHub Pages環境を使用
- デプロイ後のURLを出力

#### ステップ詳細

```yaml
- name: Deploy to GitHub Pages
  id: deployment
  uses: actions/deploy-pages@v4
```

アーティファクトをGitHub Pagesにデプロイします。

## デプロイ後のサイト構造

デプロイされたサイトは以下の構造になります：

```
https://<username>.github.io/<repository>/
├── index.html           # トップページ（プロジェクト概要）
├── nextjs/             # Next.jsアプリケーション
│   └── ...
└── shadcn/             # Storybook（UIコンポーネントカタログ）
    └── ...
```

## 注意事項

1. **Next.jsの設定**: Next.jsは静的エクスポート（`output: 'export'`）が必要です
2. **ベースパス**: リポジトリ名がベースパスになるため、Next.jsの`basePath`設定が必要な場合があります
3. **デプロイ時間**: buildとdeployの2つのジョブが順次実行されるため、完了まで数分かかります
4. **キャッシュ**: Node.jsとpnpmの依存関係がキャッシュされるため、2回目以降のビルドは高速化されます

## トラブルシューティング

### デプロイが失敗する場合

1. GitHub Pagesの設定を確認:
   - リポジトリ設定 > Pages > Source: "GitHub Actions"を選択
2. 権限設定を確認:
   - リポジトリ設定 > Actions > General > Workflow permissions
   - "Read and write permissions"が有効になっているか確認

### ビルドが失敗する場合

1. ローカル環境で`pnpm build`と`pnpm build-storybook`が成功するか確認
2. Node.jsのバージョンがpackage.jsonと一致しているか確認
3. `pnpm-lock.yaml`が最新かどうか確認

## 関連リンク

- [GitHub Actions - Configure Pages](https://github.com/actions/configure-pages)
- [GitHub Actions - Deploy Pages](https://github.com/actions/deploy-pages)
- [GitHub Actions - Upload Pages Artifact](https://github.com/actions/upload-pages-artifact)
