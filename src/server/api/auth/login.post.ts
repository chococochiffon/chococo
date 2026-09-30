// マイページのログイン(二段階認証の 1 段目): biscuit がメールアドレスとパスワードを確かめて確認コードをメールで送り、
// チャレンジを返すので、HttpOnly の Cookie に入れる(ブラウザには返さない)。確認コードの入力は /api/auth/login-verify。
// 入力エラー(422)・回数制限(429)などは、biscuit の応答をそのまま返す
export default defineEventHandler(async (event) => {
  assertSameOrigin(event)

  const body = await readBody<{ email?: string, password?: string }>(event)

  const response = await $fetch<{ two_factor: boolean, challenge: string }>(`${biscuitApiBase()}/auth/login`, {
    method: 'POST',
    headers: { Accept: 'application/json' },
    body: { email: body?.email, password: body?.password },
  }).catch(relayBiscuitError)

  setLoginChallenge(event, response.challenge)

  return { data: { two_factor: response.two_factor } }
})
