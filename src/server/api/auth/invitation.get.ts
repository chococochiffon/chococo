// 招待のリンク(?token=…&email=…)がまだ使えるかを biscuit に確かめ、登録フォームの初期値(アカウント名・メールアドレス)を返す(ログイン前)。
// 無効・期限切れ(404)・回数制限(429)は、biscuit の応答をそのまま返す
export default defineEventHandler(async (event) => {
  const query = getQuery(event)

  return await $fetch<{ data: { name: string, email: string } }>(`${biscuitApiBase()}/auth/invitation`, {
    headers: { Accept: 'application/json' },
    query: { token: query.token, email: query.email },
  }).catch(relayBiscuitError)
})
