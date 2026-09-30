// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: ['@nuxt/eslint'],
  ssr: true,
  devtools: { enabled: false },
  app: {
    head: {
      // タイトル・description・OGP は app.vue でサイト設定 API の値から設定する
      htmlAttrs: { lang: 'ja' },
      charset: 'utf-8',
      viewport: 'width=device-width, initial-scale=1',
      meta: [
        { property: 'og:type', content: 'website' },
        { name: 'twitter:card', content: 'summary_large_image' },
      ],
      script: [
        { src: '/js/scroll.js' },
      ],
      link: [
        { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
        { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' },
        { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css2?family=Zen+Maru+Gothic&display=swap' },
      ],
    },
  },
  css: [
    'bootstrap/scss/bootstrap.scss',
    'bootstrap-icons/font/bootstrap-icons.css',
    'aos/dist/aos.css',
    '~/assets/styles/main.scss',
    '~/assets/styles/mypage.scss',
  ],
  runtimeConfig: {
    // SSR 時(Nuxt サーバー → biscuit)の API のベース URL。NUXT_API_BASE で上書きする
    apiBase: 'http://localhost/api',
    // PV の記録で biscuit と共有する鍵(biscuit の PAGE_VIEW_FORWARD_KEY と同じ値)。NUXT_PAGE_VIEW_KEY で設定し、空なら PV を送らない
    pageViewKey: '',
    public: {
      // ブラウザ → biscuit の API のベース URL。NUXT_PUBLIC_API_BASE で上書きする
      apiBase: 'http://localhost/api',
      // OGP の og:url を組み立てるための公開側サイトの URL。NUXT_PUBLIC_SITE_URL で上書きする
      siteUrl: 'http://localhost:3000',
    },
  },
  compatibilityDate: '2026-09-01',
  vite: {
    css: {
      preprocessorOptions: {
        scss: {
          // Bootstrap 5.3 の SCSS が出す Dart Sass の非推奨警告を抑える
          quietDeps: true,
          silenceDeprecations: ['import', 'global-builtin', 'color-functions', 'if-function'],
        },
      },
    },
  },
  eslint: {
    config: {
      // 書式(インデント・引用符・セミコロンなし・末尾カンマなど)も ESLint で揃える
      stylistic: true,
    },
  },
})
