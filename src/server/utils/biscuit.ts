import type { FetchError } from 'ofetch'
import type { H3Event } from 'h3'

// マイページのログインで biscuit が発行した API トークンを入れる Cookie の名前。
// ブラウザの JavaScript からは読めない HttpOnly の Cookie にし、biscuit へは chococo のサーバーから Bearer で送る
// (chococo と biscuit は別ドメインのため、biscuit の Cookie・セッションは使えない)
export const USER_TOKEN_COOKIE = 'chococo_token'

/**
 * Nuxt サーバーから biscuit の API を呼ぶときのベース URL。
 */
export function biscuitApiBase(): string {
  return useRuntimeConfig().apiBase
}

export function getUserToken(event: H3Event): string | undefined {
  return getCookie(event, USER_TOKEN_COOKIE)
}

/**
 * API トークンを Cookie に保存する。有効期限は biscuit が発行したトークンの有効期限に合わせる。
 */
export function setUserToken(event: H3Event, token: string, expiresAt: string | null): void {
  setCookie(event, USER_TOKEN_COOKIE, token, {
    httpOnly: true,
    secure: !import.meta.dev,
    sameSite: 'lax',
    path: '/',
    expires: expiresAt ? new Date(expiresAt) : undefined,
  })
}

export function clearUserToken(event: H3Event): void {
  deleteCookie(event, USER_TOKEN_COOKIE, { path: '/' })
}

/**
 * 変更系のリクエストが chococo 自身のページから送られたことを確かめる(CSRF 対策)。
 * Cookie は SameSite=Lax でほかのサイトからの POST には付かないが、Origin も公開側サイトの URL と一致するかを見る。
 */
export function assertSameOrigin(event: H3Event): void {
  const origin = getRequestHeader(event, 'origin')

  if (origin && origin !== new URL(useRuntimeConfig().public.siteUrl).origin) {
    throw createError({ statusCode: 403, statusMessage: 'Forbidden' })
  }
}

/**
 * biscuit の API へ、リクエストをそのまま(メソッド・本文・Content-Type)ログイン中のユーザーのトークン付きで中継し、
 * 応答(ステータス・本文)をそのまま返す。トークンが無効(401)なら Cookie を消す。
 */
export async function proxyToBiscuit(event: H3Event, path: string): Promise<string | null> {
  const token = getUserToken(event)

  if (!token) {
    throw createError({ statusCode: 401, statusMessage: 'Unauthenticated' })
  }

  const method = event.method
  const hasBody = !['GET', 'HEAD'].includes(method)

  if (hasBody) {
    assertSameOrigin(event)
  }

  const headers: Record<string, string> = { Accept: 'application/json', Authorization: `Bearer ${token}` }
  const contentType = getRequestHeader(event, 'content-type')

  if (hasBody && contentType) {
    headers['Content-Type'] = contentType
  }

  const body = hasBody ? await readRawBody(event, false) : undefined
  const response = await fetch(`${biscuitApiBase()}${path}`, {
    method,
    headers,
    body: body ? new Uint8Array(body) : undefined,
  })

  if (response.status === 401) {
    clearUserToken(event)
  }

  setResponseStatus(event, response.status)
  setResponseHeader(event, 'content-type', response.headers.get('content-type') ?? 'application/json')

  return response.status === 204 ? null : await response.text()
}

/**
 * biscuit の API のエラー(入力エラー(422)・回数制限(429)など)を、ステータスと biscuit の応答(data)のままブラウザへ返すエラーにする。
 * 画面側は utils/errors.ts の validationErrors()・errorMessage() で data から取り出す。
 */
export function relayBiscuitError(error: FetchError): never {
  throw createError({ statusCode: error.statusCode ?? 500, statusMessage: error.statusMessage, data: error.data })
}

/**
 * ログイン前の操作(パスワード再設定など)を、トークンなしで biscuit へ中継する。
 * 本文は受け付ける項目だけを渡し、エラーは relayBiscuitError() で biscuit の応答のまま返す(ログインと同じ)。
 */
export async function postToBiscuitAsGuest<T>(event: H3Event, path: string, fields: string[]): Promise<T | null> {
  assertSameOrigin(event)

  const body = await readBody<Record<string, unknown>>(event)
  const response = await $fetch.raw<T>(`${biscuitApiBase()}${path}`, {
    method: 'POST',
    headers: { Accept: 'application/json' },
    body: Object.fromEntries(fields.map(field => [field, body?.[field]])),
  }).catch(relayBiscuitError)

  setResponseStatus(event, response.status)

  return (response._data as T | undefined) ?? null
}
