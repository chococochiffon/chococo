<script setup lang="ts">
import type { ResolveResponse } from '~/types/api'

// すべての URL をこのページで受け、biscuit のパス解決 API でトップ・固定ページ・記事を出し分ける。
// パスが変わるたびにページを作り直し、取得と 404 の判定をやり直す
definePageMeta({
  key: route => route.path,
})

const route = useRoute()

const { data: page, error } = await useApi<ResolveResponse>('/resolve', {
  key: `resolve:${route.path}`,
  query: { path: route.path },
})

if (error.value || !page.value) {
  const statusCode = error.value?.statusCode ?? 404
  throw createError({
    statusCode,
    statusMessage: statusCode === 404 ? 'Page Not Found' : 'Server Error',
    fatal: true,
  })
}

// 本文内(Inside)の呼び出しコンテンツに原文枠があれば本文はそこに表示し、なければ先頭に表示する
const hasOriginalText = computed(() =>
  page.value?.call_contents.some(callContent => callContent.call_type === 'original_text') ?? false,
)

// 記事・固定ページでは、タイトル・description・OGP 画像をそのページの内容で上書きする
useSeoMeta({
  title: () => (page.value?.type === 'top' ? undefined : page.value?.data.title),
  ogTitle: () => (page.value?.type === 'top' ? undefined : page.value?.data.title),
  description: () => {
    if (page.value?.type === 'article') return excerpt(page.value.data.content) || undefined
    if (page.value?.type === 'single_page') return page.value.data.short_sentences || undefined
    return undefined
  },
  ogImage: () => {
    if (page.value?.type === 'article') return page.value.data.thumbnail_url || undefined
    if (page.value?.type === 'single_page') return page.value.data.header_image_url || undefined
    return undefined
  },
  ogType: () => (page.value?.type === 'article' ? 'article' : 'website'),
})
</script>

<template>
  <div v-if="page">
    <TopHero v-if="page.type === 'top'" />
    <template v-else-if="!hasOriginalText">
      <PageArticleBody v-if="page.type === 'article'" :article="page.data" />
      <PageSinglePageBody v-else :page="page.data" />
    </template>
    <section id="contents">
      <CallContentBlock v-for="(callContent, index) in page.call_contents" :key="index" :call-content="callContent" />
    </section>
  </div>
</template>
