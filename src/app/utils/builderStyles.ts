import type { BuilderContent, BuilderDevice, BuilderNode, BuilderStyles, BuilderVisibilityDevice } from '~/types/builder'
import { builderComponentChildren } from './builder'

// ページビルダーのブロックのスタイルと、表示しない端末で隠す規則を CSS にする(許した形の値だけ)

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
