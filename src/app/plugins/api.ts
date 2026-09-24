// biscuit の API を呼ぶ $fetch インスタンスを $api として提供する。
// SSR 時は Nuxt サーバーから(Docker 内なら host.docker.internal 経由で)、ブラウザからは公開 URL で呼び出す。
export default defineNuxtPlugin(() => {
  const config = useRuntimeConfig()

  const api = $fetch.create({
    baseURL: import.meta.server ? config.apiBase : config.public.apiBase,
    headers: { Accept: 'application/json' },
  })

  return {
    provide: { api },
  }
})
