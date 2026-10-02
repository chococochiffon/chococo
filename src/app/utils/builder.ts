import type { ComputedRef, InjectionKey } from 'vue'
import type { Breadcrumb, SinglePage } from '~/types/api'
import type { BuilderContent, BuilderDevice, BuilderNode, BuilderStyles, BuilderTheme, BuilderVisibilityDevice } from '~/types/builder'

// ページビルダーの内容を描くための共通の処理。
// 値は biscuit が保存時に検証しているが、ここでも許した形のものだけを出す(二重の守り)

// 描ける内容の版(biscuit の SchemaMigrator::CURRENT_VERSION)
export const BUILDER_SUPPORTED_VERSION = 1

// 端末ごとのスタイルを効かせる画面幅(Bootstrap のブレイクポイントに合わせる。スマートフォンにはタブレットの上書きも効く)
const BUILDER_MEDIA_QUERIES: Record<BuilderDevice, string> = {
  tablet: '(max-width: 991.98px)',
  mobile: '(max-width: 767.98px)',
}

// 表示条件の「表示しない端末」を隠す画面幅(端末ごとに重ならないようにする)
const BUILDER_DEVICE_RANGES: Record<BuilderVisibilityDevice, string> = {
  desktop: '(min-width: 992px)',
  tablet: '(min-width: 768px) and (max-width: 991.98px)',
  mobile: '(max-width: 767.98px)',
}

// スタイルの値の形(biscuit の StyleRegistry と同じ)
const LENGTH = /^(?:0|auto|\d{1,4}(?:\.\d{1,2})?(?:px|rem|em|%|vh|vw))$/
const COLOR = /^(?:#(?:[0-9a-fA-F]{3}|[0-9a-fA-F]{6}|[0-9a-fA-F]{8})|theme:(?:primary|secondary|accent|text|light))$/
const HEX_COLOR = /^#(?:[0-9a-fA-F]{3}|[0-9a-fA-F]{6}|[0-9a-fA-F]{8})$/
// テーマのフォントの font-family と、読み込む CSS の URL(biscuit の ThemeRegistry が組み立てた形だけ)
const FONT_FAMILY = /^[A-Za-z0-9 ,'-]+$/
const FONT_HREF = /^https:\/\/fonts\.googleapis\.com\/css2\?family=[A-Za-z0-9+:;@,.]+&display=swap$/
const NUMBER = /^\d(?:\.\d{1,2})?$/

const STYLE_KINDS: Record<string, RegExp | string[]> = {
  marginTop: LENGTH,
  marginBottom: LENGTH,
  paddingTop: LENGTH,
  paddingBottom: LENGTH,
  paddingLeft: LENGTH,
  paddingRight: LENGTH,
  width: LENGTH,
  maxWidth: LENGTH,
  minHeight: LENGTH,
  fontSize: LENGTH,
  borderRadius: LENGTH,
  borderWidth: LENGTH,
  lineHeight: NUMBER,
  color: COLOR,
  backgroundColor: COLOR,
  borderColor: COLOR,
  textAlign: ['left', 'center', 'right', 'justify'],
  fontWeight: ['300', '400', '500', '600', '700', '800'],
  borderStyle: ['none', 'solid', 'dashed', 'dotted', 'double'],
}

// ブロックの中の要素に効かせるスタイル(種類 → スタイル → ブロックの要素からのセレクター)
const STYLE_TARGETS: Record<string, Record<string, string>> = {
  image: { width: ' img', maxWidth: ' img', borderRadius: ' img' },
  button: { color: ' .btn', backgroundColor: ' .btn', borderRadius: ' .btn', fontSize: ' .btn' },
}

// CSS のプロパティ名が camelCase をそのまま変えたものと違うスタイル(区切り線は上の線、ボタンの背景色は枠の色も)。
// : を含むものは値によらない宣言(Bootstrap の hr は半透明のため、線の色を指定したら不透明にする)
const STYLE_PROPERTIES: Record<string, Record<string, string[]>> = {
  divider: {
    borderColor: ['border-top-color', 'opacity:1'],
    borderWidth: ['border-top-width'],
    borderStyle: ['border-top-style'],
  },
  button: {
    backgroundColor: ['background-color', 'border-color'],
  },
}

/**
 * ブロックに付けるクラス名(スタイルのセレクターに使う。ID は英数字と _ 以外を除く)。
 */
export function builderClass(node: Pick<BuilderNode, 'id'>): string {
  return `b-${node.id.replace(/[^A-Za-z0-9_]/g, '')}`
}

function isValidStyle(name: string, value: unknown): value is string {
  const kind = STYLE_KINDS[name]
  if (kind === undefined || typeof value !== 'string') {
    return false
  }
  return Array.isArray(kind) ? kind.includes(value) : kind.test(value)
}

function kebab(name: string): string {
  return name.replace(/[A-Z]/g, letter => `-${letter.toLowerCase()}`)
}

/**
 * 1 つのブロックのスタイルを、要素ごとの CSS の規則にする。
 */
function styleRules(node: BuilderNode, styles: BuilderStyles | undefined): string[] {
  const declarations = new Map<string, string[]>()

  for (const [name, value] of Object.entries(styles ?? {})) {
    if (!isValidStyle(name, value)) {
      continue
    }
    const selector = `.${builderClass(node)}${STYLE_TARGETS[node.type]?.[name] ?? ''}`
    const properties = STYLE_PROPERTIES[node.type]?.[name] ?? [kebab(name)]
    const list = declarations.get(selector) ?? []
    list.push(...properties.map(property => (property.includes(':') ? property : `${property}:${builderCssValue(value)}`)))
    declarations.set(selector, list)
  }

  return [...declarations].map(([selector, list]) => `${selector}{${list.join(';')}}`)
}

/**
 * 内容のすべてのブロックのスタイルと、表示しない端末で隠す規則を、1 つの CSS にする。
 * 端末ごとの上書きはインラインの style では書けないため、デスクトップの値も含めてこの CSS で効かせる(あとの規則ほど優先される)。
 */
export function builderCss(content: BuilderContent): string {
  const nodes: BuilderNode[] = []
  const walk = (children: BuilderNode[] | undefined) => {
    for (const node of children ?? []) {
      nodes.push(node)
      walk(node.children)
      // コンポーネント(グローバル・独自)の中身は data.children に入っている
      walk(builderComponentChildren(node))
    }
  }
  walk(content.children)

  const base = nodes.flatMap(node => styleRules(node, node.styles))
  const responsive = (Object.keys(BUILDER_MEDIA_QUERIES) as BuilderDevice[]).map((device) => {
    const rules = nodes.flatMap(node => styleRules(node, node.responsive?.[device]))
    return rules.length ? `@media ${BUILDER_MEDIA_QUERIES[device]}{${rules.join('')}}` : ''
  })

  // 表示しない端末: その端末の画面幅のときだけ隠す(Bootstrap の .row などの display より優先する)
  const hidden = (Object.keys(BUILDER_DEVICE_RANGES) as BuilderVisibilityDevice[]).map((device) => {
    const selectors = nodes.filter(node => node.visibility?.hideOn?.includes(device)).map(node => `.${builderClass(node)}`)
    return selectors.length ? `@media ${BUILDER_DEVICE_RANGES[device]}{${selectors.join(',')}{display:none!important}}` : ''
  })

  return [...base, ...responsive, ...hidden].join('')
}

/**
 * スタイルの値を CSS の値にする(テーマの色 theme:名前 は CSS の変数 --builder-theme-名前 に。ほかはそのまま)。
 */
export function builderCssValue(value: string): string {
  return value.startsWith('theme:') ? `var(--builder-theme-${value.slice('theme:'.length)})` : value
}

/**
 * テーマを、ビルダーの要素に置く CSS の変数にする(許した形の値だけ)。フォントは選んだものだけ。
 */
export function builderThemeVariables(theme: BuilderTheme | undefined): Record<string, string> {
  const variables: Record<string, string> = {}

  for (const [name, value] of Object.entries(theme?.colors ?? {})) {
    if (/^[a-z]+$/.test(name) && HEX_COLOR.test(value)) {
      variables[`--builder-theme-${name}`] = value
    }
  }

  for (const part of ['heading', 'body'] as const) {
    const font = theme?.fonts?.[part]
    if (font && FONT_FAMILY.test(font.family)) {
      variables[`--builder-theme-${part}-font`] = font.family
    }
  }

  return variables
}

/**
 * テーマのフォントの読み込む CSS の URL(許した形のものだけ。同じものは 1 つに)。
 */
export function builderThemeFontHrefs(theme: BuilderTheme | undefined): string[] {
  const hrefs = [theme?.fonts?.heading?.href, theme?.fonts?.body?.href].filter((href): href is string => typeof href === 'string' && FONT_HREF.test(href))
  return [...new Set(hrefs)]
}

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
