// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2026-09-01',
  ssr: true,
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
  ],
  runtimeConfig: {
    // SSR 時(Nuxt サーバー → biscuit)の API のベース URL。NUXT_API_BASE で上書きする
    apiBase: 'http://localhost/api',
    public: {
      // ブラウザ → biscuit の API のベース URL。NUXT_PUBLIC_API_BASE で上書きする
      apiBase: 'http://localhost/api',
      // OGP の og:url を組み立てるための公開側サイトの URL。NUXT_PUBLIC_SITE_URL で上書きする
      siteUrl: 'http://localhost:3000',
    },
  },
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
  devtools: { enabled: false },
})
