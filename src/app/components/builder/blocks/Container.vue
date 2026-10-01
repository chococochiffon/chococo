<script setup lang="ts">
import type { BuilderNode } from '~/types/builder'

// コンテナ: 中身の幅をそろえる(Bootstrap の .container。最大幅はスタイルの maxWidth で変えられる)
defineProps<{
  node: BuilderNode
}>()
</script>

<template>
  <div class="container">
    <BuilderNodeView v-for="child in node.children ?? []" :key="child.id" :node="child" />
  </div>
</template>
