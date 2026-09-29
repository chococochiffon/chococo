// マイページのログアウト: biscuit のトークンを無効にして、Cookie を消す(トークンが無効になっていても Cookie は消す)
export default defineEventHandler(async (event) => {
  assertSameOrigin(event)

  const token = getUserToken(event)

  if (token) {
    await $fetch(`${biscuitApiBase()}/auth/logout`, {
      method: 'POST',
      headers: { Accept: 'application/json', Authorization: `Bearer ${token}` },
    }).catch(() => undefined)
  }

  clearUserToken(event)
  setResponseStatus(event, 204)

  return null
})
