import type { CallContent, CallContentItems, LinkItem, UserDetail } from '~/types/api'

/**
 * 呼び出しコンテンツの実データ(単一表示はオブジェクト・一覧表示は配列)を、種別ごとに配列へそろえる。
 */
export function callContentItems(callContent: CallContent): CallContentItems {
  const toArray = <T>(value: T | T[] | null | undefined): T[] =>
    value == null ? [] : Array.isArray(value) ? value : [value]

  if ('articles' in callContent) {
    return { kind: 'articles', items: toArray(callContent.articles) }
  }
  if ('single_pages' in callContent) {
    return { kind: 'single_pages', items: toArray(callContent.single_pages) }
  }
  if ('user_details' in callContent) {
    return { kind: 'user_details', items: toArray(callContent.user_details) }
  }

  return { kind: null, items: [] }
}

/**
 * 呼び出しコンテンツの実データを、リンク系の表示用の項目にそろえる。
 */
export function toLinkItems(content: CallContentItems): LinkItem[] {
  switch (content.kind) {
    case 'articles':
      return content.items.map(article => ({
        key: `article-${article.id}`,
        title: article.title,
        text: excerpt(article.content, 80) || null,
        imageUrl: article.thumbnail_url,
        path: article.path,
        date: article.published_at,
      }))
    case 'single_pages':
      return content.items.map(page => ({
        key: `single-page-${page.id}`,
        title: page.title,
        text: page.short_sentences,
        imageUrl: page.header_image_url,
        path: page.path,
        date: null,
      }))
    case 'user_details':
      return content.items.map(userDetail => ({
        key: `user-detail-${userDetail.id}`,
        title: userDisplayName(userDetail) ?? '',
        text: userDetail.comment,
        imageUrl: userDetail.user_image_url,
        path: null,
        date: null,
      }))
    default:
      return []
  }
}

/**
 * ユーザー詳細の名前の表示設定に従って表示名を返す(非表示の場合は null)。
 */
export function userDisplayName(userDetail: UserDetail): string | null {
  switch (userDetail.name_settings) {
    case 2:
      return [userDetail.family_name, userDetail.first_name].filter(Boolean).join(' ') || null
    case 3:
      return userDetail.nick_name
    case 4:
      return userDetail.first_name
    default:
      return null
  }
}

/**
 * ISO 8601 の日時を「YYYY/MM/DD」(日本時間)に整形する。SSR とブラウザで結果がずれないようタイムゾーンを固定する。
 */
export function formatDate(iso: string | null): string {
  if (!iso) {
    return ''
  }

  return new Date(iso).toLocaleDateString('ja-JP', {
    timeZone: 'Asia/Tokyo',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  })
}

/**
 * HTML(本文リッチテキスト)からタグを除いて先頭 length 文字の抜粋を作る(description 用)。
 */
export function excerpt(html: string | null, length = 120): string {
  if (!html) {
    return ''
  }

  const text = html.replace(/<[^>]*>/g, ' ').replace(/&nbsp;/g, ' ').replace(/\s+/g, ' ').trim()

  return text.length > length ? `${text.slice(0, length)}…` : text
}
