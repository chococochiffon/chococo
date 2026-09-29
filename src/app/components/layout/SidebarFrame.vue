<script setup lang="ts">
import type { Breadcrumb, LayoutPageType } from '~/types/api'

// ページの本文を、ページの種類ごとに設定された位置のサイドバー(biscuit のレイアウト管理)と並べ、
// パンくずを表示する設定の種類では本文(とサイドバー)の上にパンくずを出す。
// サイドバーの位置が「なし」、またはサイドバーに部品がなければ本文だけを表示する。
// SSR で本文より先にレイアウトが描画されても位置を決められるよう、ページの種類を知っている各ページの側で本文を包む
const props = withDefaults(defineProps<{
  pageType: LayoutPageType
  breadcrumbs?: Breadcrumb[]
}>(), {
  breadcrumbs: () => [],
})

const { data: layout } = await useSiteLayout()

const blocks = computed(() => layout.value?.regions.sidebar ?? [])
const position = computed(() => (blocks.value.length ? layout.value?.pages[props.pageType].sidebar_position ?? 'none' : 'none'))
const showBreadcrumbs = computed(() => props.breadcrumbs.length > 0 && (layout.value?.pages[props.pageType].show_breadcrumbs ?? false))
</script>

<template>
  <div>
    <div v-if="showBreadcrumbs" class="container pt-4">
      <AppBreadcrumbs :items="breadcrumbs" />
    </div>
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
  </div>
</template>
