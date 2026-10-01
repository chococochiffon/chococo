<script setup lang="ts">
import type { BuilderNode } from '~/types/builder'

// カラム: 行の中の 1 列。幅は 12 分割で、デスクトップは span、タブレットは spanTablet(なければ span)、
// スマートフォンは spanMobile(なければ 12 = 1 列に並べる)。Bootstrap の lg(デスクトップ)・md(タブレット)のクラスにする
const props = defineProps<{
  node: BuilderNode
}>()

const columnClass = computed(() => {
  const span = builderInt(props.node, 'span', 1, 12, 12)
  const spanTablet = builderInt(props.node, 'spanTablet', 1, 12, span)
  const spanMobile = builderInt(props.node, 'spanMobile', 1, 12, 12)

  return [`col-${spanMobile}`, `col-md-${spanTablet}`, `col-lg-${span}`]
})
</script>

<template>
  <div :class="columnClass">
    <BuilderNodeView v-for="child in node.children ?? []" :key="child.id" :node="child" />
  </div>
</template>
