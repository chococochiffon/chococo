<script setup lang="ts">
import type { CallContent, LayoutRegion } from '~/types/api'

// レイアウトに置いた呼び出しコンテンツを、領域に収まる小さなリンクの一覧で表示する
// (ヘッダーでは横並び。アーカイブは一覧ページへのリンクを添える)
const props = defineProps<{
  callContent: CallContent
  region: LayoutRegion
}>()

const linkItems = computed(() => toLinkItems(callContentItems(props.callContent)))
const customPageType = computed(() => customPageTypeOf(props.callContent))
const listPath = computed(() => customPageType.value?.path ?? '/articles')
const listLabel = computed(() => (customPageType.value ? `${customPageType.value.label}一覧へ` : '記事一覧へ'))
</script>

<template>
  <div v-if="linkItems.length">
    <ul class="list-unstyled small mb-0" :class="{ 'd-flex flex-wrap gap-3': region === 'header' }">
      <li v-for="item in linkItems" :key="item.key" :class="{ 'mb-2': region !== 'header' }">
        <NuxtLink v-if="item.path" :to="item.path" class="link-secondary">{{ item.title }}</NuxtLink>
        <span v-else class="text-body-secondary">{{ item.title }}</span>
        <small v-if="item.date && region === 'sidebar'" class="d-block text-body-secondary">{{ formatDate(item.date) }}</small>
      </li>
    </ul>
    <NuxtLink v-if="callContent.call_type === 'archive'" :to="listPath" class="d-inline-block small mt-2">{{ listLabel }}</NuxtLink>
  </div>
</template>
