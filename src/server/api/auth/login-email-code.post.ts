import type { TwoFactorMethod } from '~/types/api'

// 認証アプリのコードの代わりに、メールで確認コードを送ってもらう(機種変更などで認証アプリを使えないとき)。
// biscuit が返すメールの確認コードのチャレンジで Cookie を入れ替える
export default defineEventHandler(async (event) => {
  assertSameOrigin(event)

  const response = await $fetch<{ method: TwoFactorMethod, challenge: string }>(`${biscuitApiBase()}/auth/login/email-code`, {
    method: 'POST',
    headers: { Accept: 'application/json' },
    body: { challenge: getLoginChallenge(event) },
  }).catch(relayBiscuitError)

  setLoginChallenge(event, response.challenge)

  return { data: { method: response.method } }
})
