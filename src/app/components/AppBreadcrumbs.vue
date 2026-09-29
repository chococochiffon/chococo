<script setup lang="ts">
import type { Breadcrumb } from '~/types/api'

// パンくず: Home から表示中のページ(末尾。リンクしない)までを並べ、検索エンジン向けの構造化データ(BreadcrumbList)も出力する
const props = defineProps<{
  items: Breadcrumb[]
}>()

const config = useRuntimeConfig()

// 構造化データには URL のある項目だけを並べる(公開中のページがない途中の階層は含めない)
useHead({
  script: [{
    type: 'application/ld+json',
    innerHTML: () => JSON.stringify({
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      'itemListElement': props.items
        .filter(item => item.path !== null)
        .map((item, index) => ({
          '@type': 'ListItem',
          'position': index + 1,
          'name': item.label,
          'item': `${config.public.siteUrl}${item.path}`,
        })),
    }),
  }],
})
</script>

<template>
  <nav aria-label="breadcrumb">
    <ol class="breadcrumb small mb-0">
      <li
        v-for="(item, index) in items"
        :key="index"
        class="breadcrumb-item"
        :class="{ active: index === items.length - 1 }"
        :aria-current="index === items.length - 1 ? 'page' : undefined"
      >
        <NuxtLink v-if="item.path && index < items.length - 1" :to="item.path" class="link-secondary">{{ item.label }}</NuxtLink>
        <template v-else>{{ item.label }}</template>
      </li>
    </ol>
  </nav>
</template>
