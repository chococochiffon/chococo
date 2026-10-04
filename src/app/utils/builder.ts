import type { ComputedRef, InjectionKey } from 'vue'
import type { Breadcrumb, SinglePage } from '~/types/api'
import type { BuilderNode } from '~/types/builder'

// ページビルダーの内容を描くための共通の処理(props の読み取り・出してよい URL・部品に渡すもの)。
// スタイルの CSS は builderStyles.ts、テーマは builderTheme.ts、Custom CSS とクラス名は builderCustomCss.ts。
// 値は biscuit が保存時に検証しているが、ここでも許した形のものだけを出す(二重の守り)

// 描ける内容の版(biscuit の SchemaMigrator::CURRENT_VERSION)
export const BUILDER_SUPPORTED_VERSION = 1

/**
 * コンポーネントのブロック(global・custom)の中身のノード(biscuit がグローバルコンポーネントは公開中の内容を、
 * 独自コンポーネントは公開中の内容に差し替えた値を当てはめたものを data.children に入れる)。ほかの種類・中身がなければ空。
 */
export function builderComponentChildren(node: BuilderNode): BuilderNode[] {
  return (node.type === 'global' || node.type === 'custom') && Array.isArray(node.data?.children) ? node.data.children as BuilderNode[] : []
}

/**
 * props の文字列(なければ既定値)。
 */
export function builderString(node: BuilderNode, name: string, fallback = ''): string {
  const value = node.props[name]
  return typeof value === 'string' ? value : fallback
}

/**
 * props の整数(範囲外・なければ既定値)。
 */
export function builderInt(node: BuilderNode, name: string, min: number, max: number, fallback: number): number {
  const value = node.props[name]
  return typeof value === 'number' && Number.isInteger(value) && value >= min && value <= max ? value : fallback
}

/**
 * props の真偽値(なければ既定値)。
 */
export function builderBool(node: BuilderNode, name: string, fallback: boolean): boolean {
  const value = node.props[name]
  return typeof value === 'boolean' ? value : fallback
}

/**
 * props の選択肢(選択肢にない・なければ既定値)。
 */
export function builderEnum<T extends string>(node: BuilderNode, name: string, options: readonly T[], fallback: T): T {
  const value = node.props[name]
  return options.includes(value as T) ? value as T : fallback
}

/**
 * リンク先として出してよい URL(http(s)・mailto・tel・サイト内の / 始まり・ページ内の #)。それ以外は null。
 */
export function builderHref(value: unknown): string | null {
  if (typeof value !== 'string' || value.length > 2048) {
    return null
  }
  return /^(?:https?:\/\/[^\s\\]+|mailto:[^\s\\]+|tel:[0-9+\-() ]+|\/(?!\/)[^\s\\]*|#[^\s\\]*)$/i.test(value) ? value : null
}

/**
 * 画像として出してよい URL(biscuit が返す公開 URL。http(s) かサイト内の / 始まりで、CSS の url() を壊す文字を含まない)。それ以外は null。
 */
export function builderImageUrl(value: unknown): string | null {
  if (typeof value !== 'string') {
    return null
  }
  return /^(?:https?:\/\/|\/(?!\/))[^\s"'()\\]+$/i.test(value) ? value : null
}

/**
 * 動画のブロックの埋め込み用の URL として出してよい URL(biscuit が組み立てた YouTube(Cookie を使わない)・Vimeo の形だけ)。それ以外は null。
 */
export function builderVideoEmbedUrl(value: unknown): string | null {
  if (typeof value !== 'string') {
    return null
  }
  return /^https:\/\/(?:www\.youtube-nocookie\.com\/embed\/[A-Za-z0-9_-]{11}|player\.vimeo\.com\/video\/\d{1,12})$/.test(value) ? value : null
}

/**
 * ページビルダーで表示する固定ページ。呼び出しコンテンツの「原文」の枠(呼び出しコンテンツ API の固定ページはビルダーの内容を持たない)で、
 * 表示中の固定ページのビルダーの内容を使うために、パス解決のページ(pages/[...slug].vue)から渡す。
 */
export const builderSinglePageKey: InjectionKey<ComputedRef<SinglePage | null>> = Symbol('builderSinglePage')

/**
 * 表示しているページのパンくず(パンくずのブロック用)。パス解決のページ・プレビュー(PageResolved)から渡す。
 */
export const builderBreadcrumbsKey: InjectionKey<ComputedRef<Breadcrumb[]>> = Symbol('builderBreadcrumbs')
