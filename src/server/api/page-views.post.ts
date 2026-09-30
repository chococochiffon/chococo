import { randomUUID } from 'node:crypto'

// 訪問者の識別子(biscuit が発行するランダムな UUID)を入れる Cookie の名前。ユニークユーザー数の集計に使う
const VISITOR_COOKIE = 'biscuit_visitor_id'

// セッション(最後の表示から 30 分以内の一続きの閲覧)の識別子を入れる Cookie の名前。biscuit はハッシュにして保存する
const SESSION_COOKIE = 'chococo_pv_session'
const SESSION_MAX_AGE = 30 * 60

// 訪問者の識別子の Cookie の有効期限(ブラウザが受け付ける上限の 400 日)
const VISITOR_MAX_AGE = 400 * 24 * 60 * 60

// POST /api/page-views: 公開側のページを表示したことを、biscuit の POST /page-views へ中継して 1 PV として記録する。
// 閲覧者の IP アドレス・User-Agent・訪問者とセッションの識別子(この chococo のドメインの HttpOnly の Cookie)と、
// マイページにログイン中ならトークンを付け、biscuit とだけ共有する鍵(NUXT_PAGE_VIEW_KEY)で chococo からの中継だと示す。
// PV の記録に失敗しても表示には関係ないため、biscuit のエラー(404 のページなど)は返さず、いつも 204 を返す
export default defineEventHandler(async (event) => {
  assertSameOrigin(event)

  const key = useRuntimeConfig().pageViewKey

  if (!key) {
    setResponseStatus(event, 204)
    return null
  }

  const body = await readBody<{ path?: string, referer?: string }>(event)
  const token = getUserToken(event)
  const sessionId = getCookie(event, SESSION_COOKIE) || randomUUID()

  const cookieOptions = { httpOnly: true, secure: !import.meta.dev, sameSite: 'lax', path: '/' } as const
  setCookie(event, SESSION_COOKIE, sessionId, { ...cookieOptions, maxAge: SESSION_MAX_AGE })

  const response = await $fetch<{ visitor_id: string }>(`${biscuitApiBase()}/page-views`, {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'X-Page-View-Key': key,
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: {
      path: body?.path,
      referer: body?.referer || null,
      visitor_id: getCookie(event, VISITOR_COOKIE) || null,
      session_id: sessionId,
      // リバースプロキシの後ろに置く本番に合わせ、X-Forwarded-For があればその値を閲覧者の IP アドレスとする
      ip: getRequestIP(event, { xForwardedFor: true }) || null,
      user_agent: getRequestHeader(event, 'user-agent') || null,
    },
    timeout: 5000,
  }).catch(() => null)

  if (response?.visitor_id) {
    setCookie(event, VISITOR_COOKIE, response.visitor_id, { ...cookieOptions, maxAge: VISITOR_MAX_AGE })
  }

  setResponseStatus(event, 204)
  return null
})
