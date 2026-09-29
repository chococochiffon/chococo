<script setup lang="ts">
import type { LayoutBlock } from '~/types/api'

// サイドバー: 部品を上から順に、見出し(設定されていれば)付きで並べる
defineProps<{
  blocks: LayoutBlock[]
}>()
</script>

<template>
  <aside class="layout-sidebar py-5">
    <section v-for="(block, index) in blocks" :key="index" class="mb-4">
      <h2 v-if="block.title" class="h6 fw-bold border-bottom pb-2 mb-2">{{ block.title }}</h2>
      <p v-if="block.subtitle" class="small text-body-secondary mb-2">{{ block.subtitle }}</p>
      <LayoutBlockItem :block="block" region="sidebar" />
    </section>
  </aside>
</template>
