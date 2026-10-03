// biscuit の API を呼ぶ $fetch インスタンスを $api として提供する。
// SSR 時は Nuxt サーバーから(Docker 内なら host.docker.internal 経由で)、ブラウザからは公開 URL で呼び出す。
// ページビルダーのプレビュー(/builder-preview)では、URL のプレビューの署名(id・expires・signature)を X-Biscuit-Preview-* の
// ヘッダーですべての API の呼び出しに付ける(biscuit はインストール中、この署名が正しい読み取りだけを通す)
export default defineNuxtPlugin(() => {
  const config = useRuntimeConfig()
  const route = useRouter().currentRoute

  const api = $fetch.create({
    baseURL: import.meta.server ? config.apiBase : config.public.apiBase,
    headers: { Accept: 'application/json' },
    onRequest({ options }) {
      const { id, expires, signature } = route.value.query

      if (route.value.path !== '/builder-preview' || typeof id !== 'string' || typeof expires !== 'string' || typeof signature !== 'string') {
        return
      }

      const headers = new Headers(options.headers)
      headers.set('X-Biscuit-Preview-Id', id)
      headers.set('X-Biscuit-Preview-Expires', expires)
      headers.set('X-Biscuit-Preview-Signature', signature)
      options.headers = headers
    },
  })

  return {
    provide: { api },
  }
})
