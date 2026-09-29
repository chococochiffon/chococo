<script setup lang="ts">
// コピーライト表記(サイト設定のサイトタイトル)
const { data: siteSetting } = await useSiteSetting()

const siteTitle = computed(() => siteSetting.value?.site_title || 'Chococo Chiffon')
const year = new Date().getFullYear()
</script>

<template>
  <span class="text-body-secondary">&copy; {{ year }} {{ siteTitle }}.</span>
</template>
