// ログインの確認コードを送り直す。biscuit が返す新しいチャレンジで Cookie を入れ替える(それまでのコードは使えなくなる)
export default defineEventHandler(async (event) => {
  assertSameOrigin(event)

  const response = await $fetch<{ challenge: string }>(`${biscuitApiBase()}/auth/login/resend`, {
    method: 'POST',
    headers: { Accept: 'application/json' },
    body: { challenge: getLoginChallenge(event) },
  }).catch(relayBiscuitError)

  setLoginChallenge(event, response.challenge)
  setResponseStatus(event, 204)

  return null
})
