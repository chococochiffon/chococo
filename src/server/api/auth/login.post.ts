import type { Me } from '~/types/api'

// マイページのログイン: biscuit で API トークンを発行してもらい、HttpOnly の Cookie に入れる(トークンはブラウザに返さない)。
// 入力エラー(422)・回数制限(429)などは、biscuit の応答をそのまま返す
export default defineEventHandler(async (event) => {
  assertSameOrigin(event)

  const body = await readBody<{ email?: string, password?: string }>(event)

  const response = await $fetch<{ token: string, expires_at: string | null, user: Me }>(`${biscuitApiBase()}/auth/login`, {
    method: 'POST',
    headers: { Accept: 'application/json' },
    body: { email: body?.email, password: body?.password },
  }).catch(relayBiscuitError)

  setUserToken(event, response.token, response.expires_at)

  return { data: response.user }
})
