<script setup lang="ts">
import type { BuilderNode } from '~/types/builder'

// 行: カラムを横に並べる(Bootstrap の .row。カラムの間の余白は gap の 0〜5 段階)
const props = defineProps<{
  node: BuilderNode
}>()

const gap = computed(() => builderInt(props.node, 'gap', 0, 5, 3))
</script>

<template>
  <div class="row" :class="`g-${gap}`">
    <BuilderNodeView v-for="child in node.children ?? []" :key="child.id" :node="child" />
  </div>
</template>
