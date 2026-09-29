import type { UseFetchOptions } from 'nuxt/app'
import type { GalleryCategory, GalleryImage, Layout, QuestionAnswer, SiteSetting } from '~/types/api'

/**
 * biscuit の API を useFetch で呼び出す(パスは /api からの相対。例: '/resolve')。
 */
export function useApi<ResT, DataT = ResT>(url: string | (() => string), options?: UseFetchOptions<ResT, DataT>) {
  return useFetch(url, {
    ...options,
    $fetch: useNuxtApp().$api as typeof $fetch,
  })
}

/**
 * biscuit の API の { data } の中身を、キーを固定して取得する(各所の呼び出しを 1 回にまとめ、ページを移動しても取得し直さない)。
 */
function useApiData<T>(key: string, url: string, query?: Record<string, unknown>) {
  return useApi<{ data: T }, T>(url, {
    key,
    query,
    transform: response => response.data,
  })
}

/**
 * サイト設定(タイトル・説明・アイコン・サイト画像)を取得する。
 */
export function useSiteSetting() {
  return useApiData<SiteSetting>('site-setting', '/site-setting')
}

/**
 * レイアウト(ページの種類ごとのサイドバーの位置と、ヘッダー・サイドバー・フッターに置く部品)を取得する。
 */
export function useSiteLayout() {
  return useApiData<Layout>('layout', '/layout')
}

/**
 * Q&A 一覧(登録順)を取得する。topView を指定すると簡易版(true)・分岐あり(false)だけに絞り込む。
 */
export function useQuestionAnswers(topView?: boolean) {
  return useApiData<QuestionAnswer[]>(
    `question-answers:${topView ?? 'all'}`,
    '/question-answers',
    topView === undefined ? {} : { top_view: topView ? 1 : 0 },
  )
}

/**
 * ギャラリー画像の一覧(並び順)をすべて取得する。
 */
export function useGalleryImages() {
  return useApiData<GalleryImage[]>('gallery-images', '/gallery-images')
}

/**
 * ギャラリー画像の分類の一覧(並び順)をすべて取得する。
 */
export function useGalleryCategories() {
  return useApiData<GalleryCategory[]>('gallery-categories', '/gallery-categories')
}
