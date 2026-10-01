<script setup lang="ts">
import type { BuilderContent } from '~/types/builder'

// biscuit のページビルダーの内容(ノードの木)を描く。トップ・固定ページ・プレビューで使う。
// スタイルは端末ごとの上書きもまとめて 1 つの <style> にし、各ブロックにはクラス名(builderClass())だけを付ける。
// 知らない版の内容は、形が違うおそれがあるため描かない(biscuit を新しくしたのに chococo が古い場合)
const props = defineProps<{
  content: BuilderContent
}>()

const supported = computed(() => props.content.version === BUILDER_SUPPORTED_VERSION)

if (!supported.value) {
  console.warn(`ページビルダーの内容の版(${props.content.version})に対応していないため、表示しません。`)
}

const css = computed(() => (supported.value ? builderCss(props.content) : ''))

useHead({
  style: [{ key: 'page-builder', textContent: css }],
})
</script>

<template>
  <div v-if="supported" class="page-builder">
    <BuilderNodeView v-for="node in content.children" :key="node.id" :node="node" />
  </div>
</template>
