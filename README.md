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
- `src/app/components/call-content/` — 呼び出しコンテンツを `call_type`（`short_sentence`/`original_text`/`link_list`/`link`/`archive`/`skill_list`/`tile_list`/`accordion`）ごとに表示する部品。`Block.vue` が振り分ける。タイルリスト（ギャラリー画像）は `components/gallery/Tiles.vue`、開閉パネル（簡易版の Q&A）は FAQ と同じ `components/faq/Item.vue` で表示する。
- `src/app/pages/gallery.vue` — ギャラリー（`GET /api/gallery-images` を並び順ですべて表示し、`GET /api/gallery-categories` の分類のボタンで絞り込む）。画像をクリックすると名前・コメント付きで拡大表示する。
- `src/app/components/page/` — 記事・固定ページの本文。
- ナビ・フッターは `GET /api/call-contents?place=3`（その他）、タイトル・OGP などは `GET /api/site-setting` から取得する。
- `src/app/components/TopHero.vue` — トップのメインビジュアル。サイト設定の `top_slider_images`（16:9。切り取らずに全体を見せるため、ヘッダーを除いた画面の高さに収まる幅まで縮めて中央に置く）を `TopSlider.vue` でフェード切り替え（5秒ごと・ホバー中と視差効果を減らす設定では停止、前後ボタン・インジケーター付き、`url` があればリンク）で表示する。未登録なら既定の画像にサイト名・説明を重ねる（サイト設定の `site_image` は OGP 用）。
- 型チェックは `src` で `npm run typecheck`。
- ESLint（`@nuxt/eslint`。設定は `src/eslint.config.mjs`、書式も ESLint で揃える）は `src` で `npm run lint`、自動修正は `npm run lint:fix`。
- コンテナの `node_modules` はホストと共有しない（匿名ボリューム）。`package.json` の依存関係を変えたら、`docker compose up --build -V` で作り直す（または `docker compose exec nuxt-app npm install`）。
- Docker で起動中にページファイル（`src/app/pages/`）や部品（`src/app/components/`）を追加した場合は、`docker compose restart` でルート・部品を読み込み直す。部品を追加して再起動しないと、サーバー側では表示されても、ブラウザ側で「Failed to resolve component」の警告が出て表示が消えることがある。
