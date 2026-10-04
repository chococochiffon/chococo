import type { BuilderContent, BuilderNode } from '~/types/builder'
import { builderComponentChildren } from './builder'

// Custom CSS とブロックの追加のクラス名の確かめ(biscuit の Support\Builder\CustomCss と同じ規則。biscuit が保存時に確かめているが、ここでも確かめる)
const CUSTOM_CSS_MAX_LENGTH = 20000
const CUSTOM_CSS_FORBIDDEN = [/@import/i, /@charset/i, /@namespace/i, /expression\s*\(/i, /javascript\s*:/i, /(?<![\w-])behavior\s*:/i, /-moz-binding/i, /image-set\s*\(/i, /(?<![\w-])src\s*\(/i]
const CLASS_NAME = /^[A-Za-z_][A-Za-z0-9_-]{0,49}$/

/**
 * コメントと文字列の中身を除いた CSS(閉じていなければ null)。
 */
function withoutCommentsAndStrings(css: string): string | null {
  let result = ''
  for (let i = 0; i < css.length; i++) {
    const char = css[i]
    if (char === '/' && css[i + 1] === '*') {
      const end = css.indexOf('*/', i + 2)
      if (end === -1) return null
      i = end + 1
      continue
    }
    if (char === '"' || char === '\'') {
      const end = css.indexOf(char, i + 1)
      if (end === -1) return null
      result += char + char
      i = end
      continue
    }
    result += char
  }
  return result
}

/**
 * Custom CSS を .page-builder の中にネストしても外へ抜け出せず、外部を読み込まず、スクリプトを動かせないか。
 */
export function builderCustomCssIsSafe(css: unknown): css is string {
  if (typeof css !== 'string' || css === '' || css.length > CUSTOM_CSS_MAX_LENGTH || css.includes('<') || css.includes('\\')) {
    return false
  }
  const code = withoutCommentsAndStrings(css)
  if (code === null || CUSTOM_CSS_FORBIDDEN.some(pattern => pattern.test(code))) {
    return false
  }
  const urls = [...css.matchAll(/url\s*\(\s*(["']?)([^"')]*)\1\s*\)/gi)]
  if (!urls.every(match => /^\/(?!\/)\S*$/.test(match[2] ?? '')) || (css.match(/url\s*\(/gi) ?? []).length !== urls.length) {
    return false
  }
  let depth = 0
  for (const char of code) {
    depth += char === '{' ? 1 : char === '}' ? -1 : 0
    if (depth < 0) return false
  }
  return depth === 0
}

/**
 * 内容の Custom CSS(サイト共通 → 置いたコンポーネント → ページの順)を、.page-builder の中にネストした 1 つの CSS にする。
 * 確かめを通らない CSS は出さない。
 */
export function builderCustomCss(content: BuilderContent): string {
  const componentCss: unknown[] = []
  const walk = (nodes: BuilderNode[] | undefined) => {
    for (const node of nodes ?? []) {
      if ((node.type === 'global' || node.type === 'custom') && !componentCss.includes(node.data?.css)) {
        componentCss.push(node.data?.css)
      }
      walk(node.children)
      walk(builderComponentChildren(node))
    }
  }
  walk(content.children)

  return [content.theme?.css, ...componentCss, content.css]
    .filter(builderCustomCssIsSafe)
    .map(css => `.page-builder{${css}}`)
    .join('')
}

/**
 * ブロックに付ける追加のクラス名(許した形のものだけ)。
 */
export function builderNodeClasses(node: BuilderNode): string[] {
  return Array.isArray(node.classes) ? node.classes.filter((name): name is string => typeof name === 'string' && CLASS_NAME.test(name)).slice(0, 5) : []
}
