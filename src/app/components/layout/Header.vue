<script setup lang="ts">
import type { LayoutBlock } from '~/types/api'

// ヘッダー: 部品を左から順にナビバーの中へ並べ、ログイン中なら最後にマイページへのリンクを置く(ナビメニューはスマホ表示で開閉する)
defineProps<{
  blocks: LayoutBlock[]
}>()

// マイページへのリンクは、ログイン中のときだけ出す
const { me, ensureMe } = useMe()
await ensureMe()
</script>

<template>
  <section class="d-flex align-items-center border-bottom nav-bg-color">
    <div class="container">
      <div class="py-1 mb-4">
        <nav class="navbar navbar-light navbar-expand-md">
          <div class="container-fluid gap-2">
            <LayoutBlockItem v-for="(block, index) in blocks" :key="index" :block="block" region="header" />
            <NuxtLink v-if="me" to="/mypage" class="nav-link small text-body-secondary text-nowrap">
              <i class="bi bi-person-circle" /> マイページ
            </NuxtLink>
          </div>
        </nav>
      </div>
    </div>
  </section>
</template>
