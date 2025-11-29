# .github/workflows/shadcn_release.yml

## 概要

shadcnパッケージをnpmレジストリに自動公開するためのGitHub Actionsワークフローです。`shadcn-v*`形式のGitHubリリースが公開されると自動的にトリガーされます。

## トリガー条件

- **イベント**: GitHubリリースが公開されたとき (`release.published`)
- **フィルター**: リリースタグが`shadcn-v`で始まる場合のみ実行
  - 例: `shadcn-v1.0.0`, `shadcn-v1.2.3`など

## ワークフローの流れ

### 1. 環境セットアップ
- **リポジトリのチェックアウト**: `actions/checkout@v6`を使用してコードを取得
- **pnpmのセットアップ**: バージョン10.23.0をインストール
- **Node.jsのセットアップ**: 
  - `package.json`で指定されたNode.jsバージョンを使用
  - pnpmキャッシュを有効化して依存関係のインストールを高速化
  - npmレジストリを設定

### 2. ビルド
- **依存関係のインストール**: `pnpm install`で全パッケージの依存関係をインストール
- **shadcnパッケージのビルド**: `pnpm --filter shadcn build`でshadcnパッケージのみをビルド

### 3. バージョン更新とパブリッシュ
- **パッケージバージョンの更新**: 
  - リリースタグから`shadcn-v`プレフィックスを除いたバージョン番号を抽出
  - 例: `shadcn-v1.2.3` → `1.2.3`
  - `package.json`のバージョンを更新（Git tagは作成しない）
- **npmへの公開**: 
  - `packages/shadcn`ディレクトリで`pnpm publish`を実行
  - `--no-git-checks`オプションでGitの状態チェックをスキップ
  - `NPM_TOKEN`シークレットを使用して認証

## 必要な権限

- `contents: read` - リポジトリの内容を読み取り
- `packages: write` - パッケージを公開

## 必要なシークレット

- `NPM_TOKEN`: npmレジストリへの公開に必要な認証トークン
  - リポジトリの Settings > Secrets and variables > Actions で設定

## 使用方法

1. GitHubのリリースページで新しいリリースを作成
2. タグ名を`shadcn-v{バージョン}`形式で指定（例: `shadcn-v1.0.0`）
3. リリースを公開すると、自動的にワークフローが実行される
4. ワークフローが完了すると、指定したバージョンでnpmに公開される

