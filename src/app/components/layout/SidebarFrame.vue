<script setup lang="ts">
import type { LayoutPageType } from '~/types/api'

// ページの本文を、ページの種類ごとに設定された位置のサイドバー(biscuit のレイアウト管理)と並べる。
// サイドバーの位置が「なし」、またはサイドバーに部品がなければ本文だけを表示する。
// SSR で本文より先にレイアウトが描画されても位置を決められるよう、ページの種類を知っている各ページの側で本文を包む
const props = defineProps<{
  pageType: LayoutPageType
}>()

const { data: layout } = await useSiteLayout()

const blocks = computed(() => layout.value?.regions.sidebar ?? [])
const position = computed(() => (blocks.value.length ? layout.value?.pages[props.pageType].sidebar_position ?? 'none' : 'none'))
</script>

<template>
  <slot v-if="position === 'none'" />
  <div v-else class="container">
    <div class="row">
      <div class="layout-main col-lg-9" :class="{ 'order-lg-2': position === 'left' }">
        <slot />
      </div>
      <div class="col-lg-3" :class="{ 'order-lg-1': position === 'left' }">
        <LayoutSidebar :blocks="blocks" />
      </div>
    </div>
  </div>
</template>
