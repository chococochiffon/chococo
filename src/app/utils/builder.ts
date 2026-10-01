import type { ComputedRef, InjectionKey } from 'vue'
import type { SinglePage } from '~/types/api'
import type { BuilderContent, BuilderDevice, BuilderNode, BuilderStyles } from '~/types/builder'

// ページビルダーの内容を描くための共通の処理。
// 値は biscuit が保存時に検証しているが、ここでも許した形のものだけを出す(二重の守り)

// 描ける内容の版(biscuit の SchemaMigrator::CURRENT_VERSION)
export const BUILDER_SUPPORTED_VERSION = 1

// 端末ごとのスタイルを効かせる画面幅(Bootstrap のブレイクポイントに合わせる。スマートフォンにはタブレットの上書きも効く)
const BUILDER_MEDIA_QUERIES: Record<BuilderDevice, string> = {
  tablet: '(max-width: 991.98px)',
  mobile: '(max-width: 767.98px)',
}

// スタイルの値の形(biscuit の StyleRegistry と同じ)
const LENGTH = /^(?:0|auto|\d{1,4}(?:\.\d{1,2})?(?:px|rem|em|%|vh|vw))$/
const COLOR = /^#(?:[0-9a-fA-F]{3}|[0-9a-fA-F]{6}|[0-9a-fA-F]{8})$/
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
    list.push(...properties.map(property => (property.includes(':') ? property : `${property}:${value}`)))
    declarations.set(selector, list)
  }

  return [...declarations].map(([selector, list]) => `${selector}{${list.join(';')}}`)
}

/**
 * 内容のすべてのブロックのスタイルを、1 つの CSS にする。
 * 端末ごとの上書きはインラインの style では書けないため、デスクトップの値も含めてこの CSS で効かせる(あとの規則ほど優先される)。
 */
export function builderCss(content: BuilderContent): string {
  const nodes: BuilderNode[] = []
  const walk = (children: BuilderNode[] | undefined) => {
    for (const node of children ?? []) {
      nodes.push(node)
      walk(node.children)
    }
  }
  walk(content.children)

  const base = nodes.flatMap(node => styleRules(node, node.styles))
  const responsive = (Object.keys(BUILDER_MEDIA_QUERIES) as BuilderDevice[]).map((device) => {
    const rules = nodes.flatMap(node => styleRules(node, node.responsive?.[device]))
    return rules.length ? `@media ${BUILDER_MEDIA_QUERIES[device]}{${rules.join('')}}` : ''
  })

  return [...base, ...responsive].join('')
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
 * ページビルダーで表示する固定ページ。呼び出しコンテンツの「原文」の枠(呼び出しコンテンツ API の固定ページはビルダーの内容を持たない)で、
 * 表示中の固定ページのビルダーの内容を使うために、パス解決のページ(pages/[...slug].vue)から渡す。
 */
export const builderSinglePageKey: InjectionKey<ComputedRef<SinglePage | null>> = Symbol('builderSinglePage')
