// /api/me/**: マイページの操作(プロフィール・アイコン画像・パスワードの変更)を biscuit の /api/me/** へ中継する
export default defineEventHandler(event => proxyToBiscuit(event, `/me/${getRouterParam(event, 'path')}`))
