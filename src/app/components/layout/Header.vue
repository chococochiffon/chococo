<script setup lang="ts">
import type { LayoutBlock } from '~/types/api'

// ヘッダー: 部品を左から順にナビバーの中へ並べ、ログイン中なら最後にマイページへのリンクを置く(ナビメニューはスマホ表示で開閉する)
withDefaults(defineProps<{
  blocks: LayoutBlock[]
  // ログイン中のときにマイページへのリンクを出すか(ログイン画面などでは出さない)
  showMyPage?: boolean
}>(), {
  showMyPage: true,
})

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
            <!-- アイコンと文字の縦位置を中央でそろえる(bi のアイコンは vertical-align で少し下がるため flex で並べる) -->
            <NuxtLink v-if="showMyPage && me" to="/mypage" class="nav-link small text-body-secondary text-nowrap d-inline-flex align-items-center gap-1">
              <i class="bi bi-person-circle lh-1" />マイページ
            </NuxtLink>
          </div>
        </nav>
      </div>
    </div>
  </section>
</template>
