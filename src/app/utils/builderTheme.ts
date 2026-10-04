import type { BuilderTheme } from '~/types/builder'

// ページビルダーのテーマ(色とフォント)を、ビルダーの要素に置く CSS の変数と、読み込むフォントの CSS にする(許した形の値だけ)

// テーマの色(biscuit の ThemeRegistry と同じ。名前で選ぶ theme: の形はスタイルの側で扱う)
const HEX_COLOR = /^#(?:[0-9a-fA-F]{3}|[0-9a-fA-F]{6}|[0-9a-fA-F]{8})$/

// テーマのフォントの font-family と、読み込む CSS の URL(biscuit の ThemeRegistry が組み立てた形だけ)
const FONT_FAMILY = /^[A-Za-z0-9 ,'-]+$/
const FONT_HREF = /^https:\/\/fonts\.googleapis\.com\/css2\?family=[A-Za-z0-9+:;@,.]+&display=swap$/

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
