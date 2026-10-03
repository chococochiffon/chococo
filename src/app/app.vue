<script setup lang="ts">
// サイト全体のタイトル・description・OGP・ファビコンをサイト設定 API の値から設定する
// (各ページで useSeoMeta を呼べば、そちらの値で上書きされる)
const config = useRuntimeConfig()
const route = useRoute()
const { data: siteSetting, error: siteSettingError } = await useSiteSetting()

// biscuit のインストール中(API が 503)は、作りかけのサイトを見せずに「準備中」を出す(検索エンジンにも載せず、503 を返す)。
// ページビルダーのプレビューは署名付きで API を読めるため、ふだんどおり表示する
const preparing = computed(() => siteSettingError.value?.statusCode === 503)

if (preparing.value) {
  const event = useRequestEvent()

  if (event) {
    setResponseStatus(event, 503, 'Service Unavailable')
  }

  useSeoMeta({ robots: 'noindex, nofollow' })
}

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
  <SitePreparing v-if="preparing" />
  <NuxtLayout v-else>
    <NuxtPage />
  </NuxtLayout>
</template>
