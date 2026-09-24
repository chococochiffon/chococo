<script setup lang="ts">
// サイト全体のタイトル・description・OGP・ファビコンをサイト設定 API の値から設定する
// (各ページで useSeoMeta を呼べば、そちらの値で上書きされる)
const config = useRuntimeConfig()
const route = useRoute()
const { data: siteSetting } = await useSiteSetting()

const siteTitle = computed(() => siteSetting.value?.site_title || 'Chococo Chiffon')

useHead({
  titleTemplate: title => (title && title !== siteTitle.value ? `${title} | ${siteTitle.value}` : siteTitle.value),
  link: computed(() => (siteSetting.value?.site_icon_url ? [{ rel: 'icon', href: siteSetting.value.site_icon_url }] : [])),
})

useSeoMeta({
  description: () => siteSetting.value?.description,
  ogSiteName: siteTitle,
  ogTitle: siteTitle,
  ogDescription: () => siteSetting.value?.description,
  ogImage: () => siteSetting.value?.site_image_url,
  ogUrl: () => `${config.public.siteUrl}${route.path}`,
})
</script>

<template>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>
