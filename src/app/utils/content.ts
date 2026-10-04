import type { CallContent, CallContentItems, LinkItem } from '~/types/api'
import { customPageAsArticle, customPageAsSinglePage, customPageTableOf, isCustomArticlePage, isCustomSinglePage } from './customPage'
import { excerpt } from './format'
import { userDisplayName } from './nameSettings'

// 呼び出しコンテンツの実データを、表示する部品が使う形にそろえる

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
  const customPageTable = customPageTableOf(callContent)
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
