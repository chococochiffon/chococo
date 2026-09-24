# chococo

[biscuit](https://github.com/chococochiffon/biscuit) の公開 API からデータを取得して表示する、公開側サイト（Nuxt 4）です。

## 実行と終了

先に biscuit を起動しておきます（`http://localhost/api` で API が応答する状態）。

### 実行
```
cd docker
docker compose up --build
```

http://localhost:3000 で表示できます。

### 終了
```
cd docker
docker compose down
```

## 環境変数

`docker/docker-compose.yml` で設定しています。

| 変数 | 内容 | 既定値 |
|---|---|---|
| `NUXT_API_BASE` | SSR 時（Nuxt サーバー → biscuit）の API のベース URL | `http://host.docker.internal/api` |
| `NUXT_PUBLIC_API_BASE` | ブラウザ → biscuit の API のベース URL | `http://localhost/api` |
| `NUXT_PUBLIC_SITE_URL` | OGP の `og:url` に使う公開側サイトの URL | `http://localhost:3000` |

## 構成

- `src/app/pages/[...slug].vue` — すべての URL を受け、biscuit の `GET /api/resolve?path=...` でトップ・固定ページ・記事を出し分ける。
- `src/app/pages/articles.vue` — 記事一覧（`GET /api/articles`、`?page=N` でページ送り）。`/articles` だけに一致し、`/articles/xxx` などの記事は catch-all ページが表示する。
- `src/app/components/call-content/` — 呼び出しコンテンツを `call_type`（`short_sentence`/`original_text`/`link_list`/`link`/`archive`/`skill_list`）ごとに表示する部品。`Block.vue` が振り分ける。
- `src/app/components/page/` — 記事・固定ページの本文。
- ナビ・フッターは `GET /api/call-contents?place=3`（その他）、タイトル・OGP などは `GET /api/site-setting` から取得する。
- 型チェックは `src` で `npm run typecheck`。
- Docker で起動中にページファイル（`src/app/pages/`）を追加した場合は、`docker compose restart` でルートを読み込み直す。
