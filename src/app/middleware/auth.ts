// マイページなど、ログインが必要なページ用。ログインしていなければログインページへ送り、ログイン後に戻ってくる
export default defineNuxtRouteMiddleware(async (to) => {
  const { me, fetchMe } = useMe()

  if (!me.value) {
    await fetchMe()
  }

  if (!me.value) {
    return navigateTo({ path: '/login', query: { redirect: to.fullPath } })
  }
})
