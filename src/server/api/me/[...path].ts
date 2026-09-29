// /api/me/**: マイページの操作(プロフィール・アイコン画像・パスワードの変更、記事の投稿と承認の申請)を biscuit の /api/me/** へ中継する。
// 記事の一覧の絞り込み・ページ送り(?approval=・?page=)やタグの検索(?q=)のため、クエリ文字列もそのまま渡す
export default defineEventHandler(event => proxyToBiscuit(event, `/me/${getRouterParam(event, 'path')}${getRequestURL(event).search}`))
