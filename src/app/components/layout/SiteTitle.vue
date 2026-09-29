<script setup lang="ts">
import type { LayoutRegion } from '~/types/api'

// サイトタイトル(サイト設定)。ヘッダーではトップへのリンクにする
defineProps<{
  region: LayoutRegion
}>()

const { data: siteSetting } = await useSiteSetting()
const siteTitle = computed(() => siteSetting.value?.site_title || 'Chococo Chiffon')
</script>

<template>
  <NuxtLink
    v-if="region === 'header'"
    to="/"
    class="navbar-brand d-flex align-items-center mb-3 mb-md-0 me-md-auto link-body-emphasis text-decoration-none"
  >
    <span class="fs-4">{{ siteTitle }}</span>
  </NuxtLink>
  <NuxtLink v-else to="/" class="fw-bold link-body-emphasis text-decoration-none">{{ siteTitle }}</NuxtLink>
</template>
