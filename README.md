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
| `NUXT_PAGE_VIEW_KEY` | PV の記録で biscuit と共有する鍵（biscuit の `PAGE_VIEW_FORWARD_KEY` と同じ値。空なら PV を送らない。本番では推測されない値にする） | `local-page-view-key` |

## 構成

- `src/app/pages/[...slug].vue` — すべての URL を受け、biscuit の `GET /api/resolve?path=...` でトップ・固定ページ・記事を出し分ける。
- `src/app/pages/articles.vue` — 記事一覧（`GET /api/articles`、`?page=N` でページ送り）。`/articles` だけに一致し、`/articles/xxx` などの記事は catch-all ページが表示する。
- `src/app/components/call-content/` — 呼び出しコンテンツを `call_type`（`short_sentence`/`original_text`/`link_list`/`link`/`archive`/`skill_list`/`tile_list`/`accordion`）ごとに表示する部品。`Block.vue` が振り分ける。タイルリスト（ギャラリー画像）は `components/gallery/Tiles.vue`、開閉パネル（簡易版の Q&A）は FAQ と同じ `components/faq/Item.vue` で表示する。
- カスタムページ（biscuit で登録した種類ごとのページ。URL は `/カスタム名の複数形/スラッグ`）は `[...slug].vue` が表示する。パス解決 API の `type=custom_page_list` は `components/custom-page/List.vue`（`GET /api/custom-pages/{name}` の一覧）、`type=custom_page` は記事型を記事・固定ページ型を固定ページと同じ部品で表示し、カスタムフォームの項目を `components/custom-page/Fields.vue` で並べる。ナビには、レイアウト API のナビメニューの部品が返す項目（`items`。biscuit で登録した項目、未登録なら自動で並べた項目）を並べ、カスタムページの種類の一覧の項目（`prefix`）はその下の各ページを開いているときも選択中にする。呼び出しコンテンツの実データ（キーは `user_make_…`）は `utils/content.ts` の `callContentItems()` が記事・固定ページとしてそろえる。
- `src/app/pages/authors/[id].vue` — 投稿者ページ（biscuit の `GET /api/authors/{id}` のプロフィールと、`GET /api/articles?author={id}` の記事一覧）。プロフィールを公開していない投稿者は 404。記事ページの投稿者名は、投稿者ページがあればリンクになる（記事の `author.profile_path`）。プロフィールの表示は呼び出しコンテンツのスキルリストと共通の `components/ProfileCard.vue`。
- `src/app/pages/gallery.vue` — ギャラリー（`GET /api/gallery-images` を並び順ですべて表示し、`GET /api/gallery-categories` の分類のボタンで絞り込む）。画像をクリックすると名前・コメント付きで拡大表示する。
- `src/app/pages/forgot-password.vue`・`src/app/pages/reset-password.vue` — パスワードの再設定（ログイン前）。メールアドレスを入力すると biscuit が再設定のリンク（`/reset-password?token=…&email=…`）をメールで送り、そのページで新しいパスワードを設定する（ほかの端末を含めてログインは無効になり、あらためてログインする）。ログインページに「パスワードを忘れた方」のリンクがある。ログイン・パスワードの再設定のページは、パンくずを出さず、ヘッダーもサイトタイトルだけにする（`definePageMeta({ headerNavigation: false })`。`layouts/default.vue` が見る）。
- `src/app/pages/login.vue`・`src/app/pages/mypage/` — マイページ（ログイン・ダッシュボード・プロフィールとアイコン画像の変更・パスワードの変更・記事の管理）。ログイン後の既定の画面はダッシュボード（`/mypage`。表示する項目は未定で、今は見出しだけ）で、プロフィールは `/mypage/profile`。ログインできるのは biscuit の管理画面で登録したユーザーだけ。ログインが必要なページは `middleware: 'auth'`（未ログインならログインページへ送る）と `layout: 'mypage'` で、ログイン状態は `useMe()` で扱う（ヘッダーのマイページへのリンクはログイン中のときだけ出す）。
- `src/app/pages/mypage/gallery/` — マイページのギャラリーの管理（一覧・投稿・編集）。流れは記事と同じで、下書きで作り、承認を申請して biscuit の管理者が承認すると公開側の `/gallery` に出る（承認を飛ばす権限があれば「保存して公開」でそのまま公開）。フォームは `components/mypage/GalleryImageForm.vue`、分類の選択肢は公開側の `GET /api/gallery-categories`。
- `src/app/pages/login.vue` — マイページのログイン（二段階認証）。メールアドレスとパスワードを送ると biscuit から確認コードのメールが届き、同じ画面でコードを入れるとログインできる。chococo のサーバーは biscuit が返すチャレンジを HttpOnly の Cookie（`chococo_login_challenge`）に持ち、`server/api/auth/login-verify.post.ts`・`login-resend.post.ts` でコードの確認・再送を中継する。
- `src/app/pages/invitation.vue` — 管理者からの招待の受諾（ログイン前）。招待のメールのリンク（`?token=…&email=…`）から開き、アカウント名・パスワード・プロフィール・スキルを登録すると、そのままログインしてマイページへ移る。リンクが無効・期限切れなら、管理者に再送を依頼してもらう。中継は `server/api/auth/invitation.get.ts`・`invitation.post.ts`（ログインと同じくトークンを Cookie に入れる）。スキルの入力欄はプロフィールと共通の `components/mypage/SkillRows.vue`、公開する名前の選択肢は `utils/nameSettings.ts`。
- `src/app/layouts/mypage.vue`・`src/app/assets/styles/mypage.scss` — マイページ（ログイン中の画面）のレイアウト。biscuit のシステム管理画面のデザイン（左のサイドメニュー・上のトップバー・カードとテーブル）を踏襲し、公開側のヘッダー・フッターは出さない。スタイルは `.mypage-shell` の中だけに効かせ、公開側には影響させない。
- `src/app/pages/mypage/articles/` — マイページの記事の管理（一覧・作成・編集）。記事は下書きで作り、承認を申請して biscuit の管理者が承認すると公開される（公開中の記事を保存すると承認待ちに戻る）。biscuit の管理画面で承認を飛ばす権限を与えたユーザー（`GET /api/me` の `skip_approval`）は、「保存して公開」でそのまま公開され、公開中の記事を保存しても公開中のまま。URL の親パスは biscuit の管理者が登録した投稿先から選ぶ。フォームは `components/mypage/ArticleForm.vue`、本文は Quill のエディタ（`components/mypage/RichEditor.client.vue`。画像は biscuit へアップロードする）で、プレビューは公開側の記事と同じ `components/page/ArticleBody.vue` で表示する。本文は biscuit が保存時に無害化する。
- `src/server/` — マイページ用の chococo のサーバー API（Nitro）。biscuit とは別ドメインのため、ログインで biscuit が発行した API トークンを HttpOnly の Cookie（`chococo_token`）に入れてサーバー側で持ち、`/api/auth/login`・`/api/auth/logout`・`/api/me/**`（クエリ文字列も含めて）と、トークンなしで `/api/auth/forgot-password`・`/api/auth/reset-password` を biscuit へ中継する（トークンはブラウザに渡さない。変更系は Origin が `NUXT_PUBLIC_SITE_URL` と一致するときだけ受け付ける）。また、公開側のページ（`pages/[...slug].vue`）を表示し終えると `/api/page-views` へ送り、閲覧者の IP アドレス・User-Agent・Referer と、HttpOnly の Cookie に入れた訪問者の識別子（`biscuit_visitor_id`）・セッションの識別子（`chococo_pv_session`）を付けて biscuit のアクセス解析（PV の記録）へ中継する（`plugins/page-view.client.ts`）。
- `src/app/components/page/` — 記事・固定ページの本文。
- ヘッダー・サイドバー・フッターは `GET /api/layout`（biscuit のレイアウト管理）、タイトル・SNS リンク・OGP などは `GET /api/site-setting` から取得する。サイドバーはページの種類（トップ・記事・固定ページ・その他）ごとに設定された位置に、各ページが `LayoutSidebarFrame` で本文を包んで表示する。パンくず（`AppBreadcrumbs`。構造化データ BreadcrumbList も出力する）も `LayoutSidebarFrame` が本文の上に出し、中身は `[...slug].vue` ではパス解決 API の `breadcrumbs`、記事一覧・ギャラリー・FAQ では各ページで組み立てたものを使う。表示するかどうかはページの種類ごとの設定（`show_breadcrumbs`）に従う。部品を表示するコンポーネントは `src/app/components/layout/` にあり、`BlockItem.vue` が部品の種類ごとに振り分ける。
- `src/app/components/TopHero.vue` — トップのメインビジュアル。サイト設定の `top_slider_images`（16:9。切り取らずに全体を見せるため、ヘッダーを除いた画面の高さに収まる幅まで縮めて中央に置く）を `TopSlider.vue` でフェード切り替え（5秒ごと・ホバー中と視差効果を減らす設定では停止、前後ボタン・インジケーター付き、`url` があればリンク）で表示する。未登録なら既定の画像にサイト名・説明を重ねる（サイト設定の `site_image` は OGP 用）。
- 型チェックは `src` で `npm run typecheck`。
- ESLint（`@nuxt/eslint`。設定は `src/eslint.config.mjs`、書式も ESLint で揃える）は `src` で `npm run lint`、自動修正は `npm run lint:fix`。
- コンテナの `node_modules` はホストと共有しない（匿名ボリューム）。`package.json` の依存関係を変えたら、`docker compose up --build -V` で作り直す（または `docker compose exec nuxt-app npm install`）。
- Docker で起動中にページファイル（`src/app/pages/`）や部品（`src/app/components/`）、サーバー API（`src/server/`）を追加した場合は、`docker compose restart` でルート・部品を読み込み直す。部品を追加して再起動しないと、サーバー側では表示されても、ブラウザ側で「Failed to resolve component」の警告が出て表示が消えることがある。
