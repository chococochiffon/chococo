import type { BuilderContent, BuilderDevice, BuilderLayoutBox, BuilderNode } from '~/types/builder'
import { BUILDER_FREE_LAYOUT_VERSION, builderComponentChildren, builderComponentVersion } from './builder'
import { builderClass } from './builderStyles'

// 自由配置(内容の v2)のブロックの位置と大きさを CSS にする。
// 面(.builder-free)は CSS Grid の 1 つのマスで、子をすべてそこに重ね、上と左の余白(margin)で位置を決める。
// 面の高さが一番下の子に合わせて伸びるため、文章が長くなってもはみ出さない(Renderer.vue の .builder-free の規則と組み合わせる)。
// - デスクトップ: layout.desktop
// - タブレット: layout.tablet(なければデスクトップのまま。x・w が % なので縮む)
// - スマートフォン: layout.mobile。面の子のどれも持たなければ、デスクトップの y → x の順に縦 1 列(幅いっぱいから左右 16px を空け、間も 16px)に並べる

// 縦 1 列に並べるときの間(px)
const STACK_GAP = 16

// y・h の最大(biscuit の BuilderLayout::MAX_PIXELS)
const MAX_PIXELS = 20000

export interface BuilderLayoutRules {
  desktop: string[]
  tablet: string[]
  mobile: string[]
}

/**
 * 位置と大きさが正しい形か(biscuit が保存時に確かめているが、ここでも確かめる)。
 */
function isValidBox(box: unknown): box is BuilderLayoutBox {
  if (typeof box !== 'object' || box === null) {
    return false
  }
  const { x, y, w, h } = box as Record<string, unknown>
  const percent = (value: unknown, min: number) => typeof value === 'number' && Number.isFinite(value) && value >= min && value <= 100
  const pixels = (value: unknown, min: number) => Number.isInteger(value) && (value as number) >= min && (value as number) <= MAX_PIXELS

  return percent(x, 0) && percent(w, 1) && (x as number) + (w as number) <= 100.001 && pixels(y, 0) && (h === undefined || pixels(h, 1))
}

/**
 * 1 つのブロックを、面の中の位置と大きさに置く規則。高さは画像なら切り抜く高さ、ボックスなら最小の高さ。
 */
function placeRules(node: BuilderNode, box: BuilderLayoutBox): string[] {
  const selector = `.${builderClass(node)}`
  const declarations = [`grid-area:1/1`, `margin:${box.y}px 0 0 ${box.x}%`, `width:${box.w}%`]
  const rules: string[] = []

  if (box.h !== undefined) {
    if (node.type === 'image') {
      declarations.push(`height:${box.h}px`)
      rules.push(`${selector} :is(a,img){display:block;width:100%;height:100%}${selector} img{object-fit:cover}`)
    }
    else {
      declarations.push(`min-height:${box.h}px`)
    }
  }
  else {
    declarations.push('height:auto', 'min-height:0')
    if (node.type === 'image') {
      rules.push(`${selector} img{width:100%}`)
    }
  }

  return [`${selector}{${declarations.join(';')}}`, ...rules]
}

/**
 * 面の子を、デスクトップの y → x の順に縦 1 列に並べる規則(スマートフォンで位置を決めていないとき)。
 */
function stackRules(children: BuilderNode[]): string[] {
  const sorted = children
    .filter(child => isValidBox(child.layout?.desktop))
    .sort((a, b) => a.layout!.desktop.y - b.layout!.desktop.y || a.layout!.desktop.x - b.layout!.desktop.x)

  // 端にくっつかないよう、左右と先頭の上にも間を空ける
  return sorted.map((child, index) => `.${builderClass(child)}{grid-area:auto;order:${index};margin:${index === 0 ? STACK_GAP : 0}px ${STACK_GAP}px ${STACK_GAP}px;width:auto}`)
}

/**
 * 自由配置の面の子(兄弟の並び)の規則。
 */
function surfaceRules(children: BuilderNode[], rules: BuilderLayoutRules): void {
  for (const child of children) {
    const layout = child.layout

    if (!layout || !isValidBox(layout.desktop)) {
      continue
    }

    rules.desktop.push(...placeRules(child, layout.desktop))

    for (const device of ['tablet', 'mobile'] as BuilderDevice[]) {
      const box = layout[device]
      if (isValidBox(box)) {
        rules[device].push(...placeRules(child, box))
      }
    }
  }

  // スマートフォンの位置を決めていない面は、縦 1 列に並べる(biscuit は兄弟で端末の位置がそろっていることを確かめている)
  if (!children.some(child => child.layout?.mobile !== undefined)) {
    rules.mobile.push(...stackRules(children))
  }
}

/**
 * 内容のすべての自由配置の面について、位置と大きさの規則を端末ごとに集める。
 * セクション・ボックスの中(v2)と、独自コンポーネントの中身の一番外側(中身が v2)が面になる。
 * コンポーネントの中身は、ページと版が違うことがあるため中身の版で決める。
 */
export function builderLayoutRules(content: Pick<BuilderContent, 'version' | 'children'>): BuilderLayoutRules {
  const rules: BuilderLayoutRules = { desktop: [], tablet: [], mobile: [] }

  const walk = (children: BuilderNode[] | undefined, version: number) => {
    for (const node of children ?? []) {
      if (version >= BUILDER_FREE_LAYOUT_VERSION && (node.type === 'section' || node.type === 'box')) {
        surfaceRules(node.children ?? [], rules)
      }
      walk(node.children, version)

      const componentVersion = builderComponentVersion(node)
      const componentChildren = builderComponentChildren(node)
      if (node.type === 'custom' && componentVersion >= BUILDER_FREE_LAYOUT_VERSION) {
        surfaceRules(componentChildren, rules)
      }
      walk(componentChildren, componentVersion)
    }
  }
  walk(content.children, content.version)

  return rules
}
