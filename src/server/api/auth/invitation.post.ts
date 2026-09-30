import type { Me } from '~/types/api'

// 招待を受けてプロフィールとパスワードを登録する(ログイン前)。biscuit がユーザーを有効にして API トークンを発行するので、
// ログインと同じく HttpOnly の Cookie に入れ、そのままマイページを使えるようにする。入力エラー(422)などは biscuit の応答をそのまま返す
export default defineEventHandler(async (event) => {
  assertSameOrigin(event)

  const body = await readBody<Record<string, unknown>>(event)
  const fields = ['token', 'email', 'name', 'password', 'password_confirmation', 'user_detail']

  const response = await $fetch<{ token: string, expires_at: string | null, user: Me }>(`${biscuitApiBase()}/auth/invitation`, {
    method: 'POST',
    headers: { Accept: 'application/json' },
    body: Object.fromEntries(fields.map(field => [field, body?.[field]])),
  }).catch(relayBiscuitError)

  setUserToken(event, response.token, response.expires_at)

  return { data: response.user }
})
