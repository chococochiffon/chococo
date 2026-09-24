import type { UseFetchOptions } from 'nuxt/app'
import type { CallContent, SiteSetting } from '~/types/api'

/**
 * biscuit の API を useFetch で呼び出す(パスは /api からの相対。例: '/resolve')。
 */
export function useApi<T>(url: string | (() => string), options?: UseFetchOptions<T>) {
  return useFetch(url, {
    ...options,
    $fetch: useNuxtApp().$api as typeof $fetch,
  })
}

/**
 * サイト設定(タイトル・説明・アイコン・サイト画像)を取得する。キーを固定して各所の呼び出しを1回にまとめる。
 */
export function useSiteSetting() {
  return useFetch('/site-setting', {
    key: 'site-setting',
    $fetch: useNuxtApp().$api as typeof $fetch,
    transform: (response: { data: SiteSetting }) => response.data,
  })
}

/**
 * ヘッダー・フッターなど共通部品に置く呼び出しコンテンツ(設置場所: その他)を取得する。
 */
export function useCommonCallContents() {
  return useFetch('/call-contents', {
    key: 'call-contents-others',
    query: { place: 3 },
    $fetch: useNuxtApp().$api as typeof $fetch,
    transform: (response: { data: CallContent[] }) => response.data,
  })
}
