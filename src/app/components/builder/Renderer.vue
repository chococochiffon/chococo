<script setup lang="ts">
import type { BuilderContent } from '~/types/builder'

// biscuit のページビルダーの内容(ノードの木)を描く。トップ・固定ページ・プレビューで使う。
// スタイルは端末ごとの上書きもまとめて 1 つの <style> にし、各ブロックにはクラス名(builderClass())だけを付ける。
// テーマの色・フォントは CSS の変数にしてこの要素に置く(ボタンのメイン・サブの色と見出し・本文のフォントは下の <style> で従わせる)。
// 知らない版の内容は、形が違うおそれがあるため描かない(biscuit を新しくしたのに chococo が古い場合)
const props = defineProps<{
  content: BuilderContent
}>()

const supported = computed(() => props.content.version === BUILDER_SUPPORTED_VERSION)

if (!supported.value) {
  console.warn(`ページビルダーの内容の版(${props.content.version})に対応していないため、表示しません。`)
}

const css = computed(() => (supported.value ? builderCss(props.content) : ''))
// テーマ(色・フォント)は CSS の変数にしてビルダーの要素に置き、ビルダーのブロックにだけ効かせる
const themeStyle = computed(() => builderThemeVariables(props.content.theme))
const fontLinks = computed(() => builderThemeFontHrefs(props.content.theme).map(href => ({ key: `builder-font-${href}`, rel: 'stylesheet' as const, href })))

useHead({
  style: [{ key: 'page-builder', textContent: css }],
  link: fontLinks,
})
</script>

<template>
  <div v-if="supported" class="page-builder builder-theme" :style="themeStyle">
    <BuilderNodeView v-for="node in content.children" :key="node.id" :node="node" />
  </div>
</template>

<style>
/* テーマ: ボタンのブロックのメイン・サブの色と、見出し・本文のフォントをテーマに従わせる(biscuit のエディタの builder.css と同じ規則) */
.builder-theme {
  font-family: var(--builder-theme-body-font, inherit);
}
.builder-theme :is(h1, h2, h3, h4, h5, h6) {
  font-family: var(--builder-theme-heading-font, inherit);
}
.builder-theme .btn-primary,
.builder-theme .btn-secondary {
  --builder-btn-color: var(--builder-theme-primary);
  --bs-btn-bg: var(--builder-btn-color);
  --bs-btn-border-color: var(--builder-btn-color);
  --bs-btn-hover-bg: color-mix(in srgb, var(--builder-btn-color) 85%, #000);
  --bs-btn-hover-border-color: color-mix(in srgb, var(--builder-btn-color) 85%, #000);
  --bs-btn-active-bg: color-mix(in srgb, var(--builder-btn-color) 80%, #000);
  --bs-btn-active-border-color: color-mix(in srgb, var(--builder-btn-color) 80%, #000);
  --bs-btn-disabled-bg: var(--builder-btn-color);
  --bs-btn-disabled-border-color: var(--builder-btn-color);
}
.builder-theme .btn-outline-primary,
.builder-theme .btn-outline-secondary {
  --builder-btn-color: var(--builder-theme-primary);
  --bs-btn-color: var(--builder-btn-color);
  --bs-btn-border-color: var(--builder-btn-color);
  --bs-btn-hover-bg: var(--builder-btn-color);
  --bs-btn-hover-border-color: var(--builder-btn-color);
  --bs-btn-active-bg: var(--builder-btn-color);
  --bs-btn-active-border-color: var(--builder-btn-color);
  --bs-btn-disabled-color: var(--builder-btn-color);
  --bs-btn-disabled-border-color: var(--builder-btn-color);
}
.builder-theme .btn-secondary,
.builder-theme .btn-outline-secondary {
  --builder-btn-color: var(--builder-theme-secondary);
}
</style>
