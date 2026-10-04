import type { Article, CallContent, CustomArticlePage, CustomPage, CustomPageType, CustomSinglePage, SinglePage } from '~/types/api'

// カスタムページ(管理画面で種類を足す記事型・固定ページ型のページ)を、記事・固定ページの部品で表示するための処理

/**
 * 呼び出しコンテンツの実データのうち、カスタムページの表のキー(user_make_○○。カスタムページでなければ undefined)。
 */
export function customPageTableOf(callContent: CallContent): `user_make_${string}` | undefined {
  return Object.keys(callContent).find(key => key.startsWith('user_make_')) as `user_make_${string}` | undefined
}

/**
 * 呼び出しコンテンツの実データがカスタムページなら、その種類(カスタムページでない・データがない場合は null)。
 */
export function customPageTypeOf(callContent: CallContent): CustomPageType | null {
  const customPageTable = customPageTableOf(callContent)
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
