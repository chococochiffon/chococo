import type { Me } from '~/types/api'

// マイページのログイン(二段階認証の 2 段目): Cookie のチャレンジと入力された確認コードを biscuit に送り、
// 発行された API トークンを HttpOnly の Cookie に入れる。コードが違う(422)などは biscuit の応答をそのまま返す
export default defineEventHandler(async (event) => {
  assertSameOrigin(event)

  const body = await readBody<{ code?: string }>(event)

  const response = await $fetch<{ token: string, expires_at: string | null, user: Me }>(`${biscuitApiBase()}/auth/login/verify`, {
    method: 'POST',
    headers: { Accept: 'application/json' },
    body: { challenge: getLoginChallenge(event), code: body?.code },
  }).catch(relayBiscuitError)

  clearLoginChallenge(event)
  setUserToken(event, response.token, response.expires_at)

  return { data: response.user }
})
