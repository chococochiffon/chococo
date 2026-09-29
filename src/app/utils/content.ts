import type { Article, CallContent, CallContentItems, CustomArticlePage, CustomPage, CustomPageType, CustomSinglePage, LinkItem, SinglePage, UserDetail } from '~/types/api'

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
  if ('gallery_images' in callContent) {
    return { kind: 'gallery_images', items: toArray(callContent.gallery_images) }
  }
  if ('question_answers' in callContent) {
    return { kind: 'question_answers', items: toArray(callContent.question_answers) }
  }

  // カスタムページは、記事型を記事・固定ページ型を固定ページとして同じ部品で表示する
  const customPageTable = Object.keys(callContent).find(key => key.startsWith('user_make_')) as `user_make_${string}` | undefined
  if (customPageTable) {
    const pages = toArray(callContent[customPageTable])
    return pages.every(isCustomArticlePage)
      ? { kind: 'articles', items: pages.map(customPageAsArticle) }
      : { kind: 'single_pages', items: pages.filter(isCustomSinglePage).map(customPageAsSinglePage) }
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
export function userDisplayName(userDetail: Pick<UserDetail, 'name_settings' | 'family_name' | 'first_name' | 'nick_name'>): string | null {
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
 * ISO 8601 の日時を「YYYY/MM/DD HH:mm」(日本時間)に整形する(マイページの一覧など、管理画面と同じ表記)。
 */
export function formatDateTime(iso: string | null): string {
  if (!iso) {
    return ''
  }

  return new Date(iso).toLocaleString('ja-JP', {
    timeZone: 'Asia/Tokyo',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
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

/**
 * 呼び出しコンテンツの実データがカスタムページなら、その種類(カスタムページでない・データがない場合は null)。
 */
export function customPageTypeOf(callContent: CallContent): CustomPageType | null {
  const customPageTable = Object.keys(callContent).find(key => key.startsWith('user_make_')) as `user_make_${string}` | undefined
  const value = customPageTable ? callContent[customPageTable] : null
  const first = Array.isArray(value) ? value[0] : value

  return first?.custom_page_type ?? null
}

/**
 * 記事型のカスタムページかどうか。
 */
export function isCustomArticlePage(page: CustomPage): page is CustomArticlePage {
  return page.custom_page_type.base_type === 'article'
}

/**
 * 固定ページ型のカスタムページかどうか。
 */
export function isCustomSinglePage(page: CustomPage): page is CustomSinglePage {
  return page.custom_page_type.base_type === 'single_page'
}

/**
 * 記事型のカスタムページを、記事の部品(カード・本文)で表示できる形にする(親パスは持たない)。
 */
export function customPageAsArticle(page: CustomArticlePage): Article {
  return { ...page, parent_path: null }
}

/**
 * 固定ページ型のカスタムページを、固定ページの部品(短文・本文)で表示できる形にする(親パスは持たず、スラッグは必須)。
 */
export function customPageAsSinglePage(page: CustomSinglePage): SinglePage {
  return { ...page, parent_path: null, slug: page.slug ?? String(page.id) }
}
