<script setup lang="ts">
import type { LayoutPageType, ResolveResponse } from '~/types/api'

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

// カスタムページは、記事型を記事・固定ページ型を固定ページとして同じ部品で表示する
const customArticle = computed(() =>
  page.value?.type === 'custom_page' && isCustomArticlePage(page.value.data) ? customPageAsArticle(page.value.data) : null,
)
const customSinglePage = computed(() =>
  page.value?.type === 'custom_page' && isCustomSinglePage(page.value.data) ? customPageAsSinglePage(page.value.data) : null,
)

// 本文として表示する記事・固定ページ(カスタムページを含む。トップ・カスタムページの一覧は null)
const article = computed(() => (page.value?.type === 'article' ? page.value.data : customArticle.value))
const singlePage = computed(() => (page.value?.type === 'single_page' ? page.value.data : customSinglePage.value))

// サイドバーの位置は、表示するページの種類(カスタムページは記事型を記事・固定ページ型を固定ページ、カスタムページの一覧はその他)で選ぶ
const layoutPageType = computed<LayoutPageType>(() =>
  page.value?.type === 'top' ? 'top' : article.value ? 'article' : singlePage.value ? 'single_page' : 'other',
)

// 記事・固定ページでは、タイトル・description・OGP 画像をそのページの内容で上書きする
// (カスタムページの一覧のタイトルは一覧の部品で設定する)
useSeoMeta({
  title: () => article.value?.title ?? singlePage.value?.title,
  ogTitle: () => article.value?.title ?? singlePage.value?.title,
  description: () => (article.value ? excerpt(article.value.content) : singlePage.value?.short_sentences) || undefined,
  ogImage: () => (article.value ? article.value.thumbnail_url : singlePage.value?.header_image_url) || undefined,
  ogType: () => (article.value ? 'article' : 'website'),
})
</script>

<template>
  <LayoutSidebarFrame v-if="page" :page-type="layoutPageType">
    <div>
      <TopHero v-if="page.type === 'top'" />
      <CustomPageList v-else-if="page.type === 'custom_page_list'" :custom-page-type="page.custom_page_type" />
      <template v-else-if="!hasOriginalText">
        <PageArticleBody v-if="article" :article="article" />
        <PageSinglePageBody v-else-if="singlePage" :page="singlePage" />
      </template>
      <CustomPageFields v-if="page.type === 'custom_page'" :fields="page.data.custom_fields ?? []" />
      <section id="contents">
        <CallContentBlock v-for="(callContent, index) in page.call_contents" :key="index" :call-content="callContent" />
      </section>
    </div>
  </LayoutSidebarFrame>
</template>
