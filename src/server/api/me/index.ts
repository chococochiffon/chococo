// GET /api/me: ログイン中のユーザーを biscuit から取得する
export default defineEventHandler(event => proxyToBiscuit(event, '/me'))
