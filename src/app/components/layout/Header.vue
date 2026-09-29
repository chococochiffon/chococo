<script setup lang="ts">
import type { LayoutBlock } from '~/types/api'

// ヘッダー: 部品を左から順にナビバーの中へ並べる(ナビメニューはスマホ表示で開閉する)
defineProps<{
  blocks: LayoutBlock[]
}>()
</script>

<template>
  <section class="d-flex align-items-center border-bottom nav-bg-color">
    <div class="container">
      <div class="py-1 mb-4">
        <nav class="navbar navbar-light navbar-expand-md">
          <div class="container-fluid gap-2">
            <LayoutBlockItem v-for="(block, index) in blocks" :key="index" :block="block" region="header" />
          </div>
        </nav>
      </div>
    </div>
  </section>
</template>
