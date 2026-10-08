<script setup lang="ts">
import type { BuilderContent } from '~/types/builder'

// biscuit のページビルダーの内容(ノードの木)を描く。トップ・固定ページ・プレビューで使う。
// スタイルは端末ごとの上書きもまとめて 1 つの <style> にし、各ブロックにはクラス名(builderClass())だけを付ける。
// テーマの色・フォントは CSS の変数にしてこの要素に置く(ボタンのメイン・サブの色と見出し・本文のフォントは下の <style> で従わせる)。
// 知らない版の内容は、形が違うおそれがあるため描かない(biscuit を新しくしたのに chococo が古い場合)。
// v1(行・カラムで流し込む配置)と v2(自由配置。セクション・ボックスの中のブロックを座標で置く)を描ける
const props = defineProps<{
  content: BuilderContent
}>()

const supported = computed(() => BUILDER_SUPPORTED_VERSIONS.includes(props.content.version))

// セクションの中を自由配置で描くかは、内容の版で決める(コンポーネントの中身は、そのブロックが中身の版を渡し直す)
provide(builderVersionKey, props.content.version)

if (!supported.value) {
  console.warn(`ページビルダーの内容の版(${props.content.version})に対応していないため、表示しません。`)
}

// ブロックのスタイルのあとに Custom CSS(.page-builder の中にネスト)を続け、Custom CSS でブロックのスタイルを上書きできるようにする
const css = computed(() => (supported.value ? builderCss(props.content) + builderCustomCss(props.content) : ''))
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
/* 自由配置(v2)の面: CSS Grid の 1 つのマスに子をすべて重ね、位置は builderLayout.ts の規則(上と左の余白・幅)で決める。
   セクションの面は中身の幅を最大 1200px にして中央に寄せる */
.builder-free {
  display: grid;
  /* 行は中身に合わせて上に詰める(最小の高さのあるボックスで、縦 1 列のときに 1 行目が引き伸ばされないように) */
  grid-template: auto / 1fr;
  align-content: start;
}
.builder-free > * {
  align-self: start;
  min-width: 0;
}
.builder-section > .builder-free {
  max-width: 1200px;
  margin: 0 auto;
}

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
