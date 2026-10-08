<script setup lang="ts">
import type { BuilderNode } from '~/types/builder'

// グローバルコンポーネント: biscuit が data.children に入れた、参照するコンポーネントの公開中の内容(セクションの並び)を、
// ページのほかのブロックと同じ部品で描く(スタイルは builderCss() が data.children もたどって出す)。中身がなければ何も出さない
const props = defineProps<{
  node: BuilderNode
}>()

const children = computed(() => builderComponentChildren(props.node))

// 中身のセクションは、ページではなく中身の内容の版で描く
provide(builderVersionKey, builderComponentVersion(props.node))
</script>

<template>
  <div class="builder-global">
    <BuilderNodeView v-for="child in children" :key="child.id" :node="child" />
  </div>
</template>
