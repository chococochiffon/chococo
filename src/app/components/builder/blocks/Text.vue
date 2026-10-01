<script setup lang="ts">
import type { BuilderNode } from '~/types/builder'

// テキスト: 管理画面のリッチテキストエディタ(Quill)で入力した HTML(biscuit が保存時に無害化している)
const props = defineProps<{
  node: BuilderNode
}>()

const html = computed(() => builderString(props.node, 'html'))
</script>

<template>
  <!-- eslint-disable-next-line vue/no-v-html -- biscuit が許可したタグ・属性だけに無害化した HTML -->
  <div class="rich-content" v-html="html" />
</template>
