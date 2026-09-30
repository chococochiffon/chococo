// PV の記録(biscuit のアクセス解析)。ページを表示し終えたら $recordPageView(path) で chococo のサーバーへ送る
// (server/api/page-views.post.ts が biscuit へ中継する)。
// Referer は、最初の表示ではブラウザの document.referrer、ページ移動では直前に表示していた chococo のページの URL にする
export default defineNuxtPlugin(() => {
  const router = useRouter()
  let referrer = document.referrer

  router.afterEach((to, from) => {
    // 最初の表示(移動元がない)は document.referrer のまま
    if (from.matched.length > 0 && to.fullPath !== from.fullPath) {
      referrer = new URL(router.resolve(from.fullPath).href, window.location.origin).href
    }
  })

  function recordPageView(path: string): void {
    $fetch('/api/page-views', {
      method: 'POST',
      body: { path, referer: referrer || null },
    }).catch(() => {
      // PV の記録に失敗しても表示には関係ないため、何もしない
    })
  }

  return {
    provide: { recordPageView },
  }
})
