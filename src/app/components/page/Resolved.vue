<script setup lang="ts">
import type { LayoutPageType, ResolveResponse } from '~/types/api'

// パス解決 API(またはページビルダーのプレビュー API)の内容を、ページの種類に応じて表示する。
// pages/[...slug].vue と pages/builder-preview.vue で共通
const props = defineProps<{
  page: ResolveResponse
}>()

// 本文内(Inside)の呼び出しコンテンツに原文枠があれば本文はそこに表示し、なければ先頭に表示する
const hasOriginalText = computed(() =>
  props.page.call_contents.some(callContent => callContent.call_type === 'original_text'),
)

// カスタムページは、記事型を記事・固定ページ型を固定ページとして同じ部品で表示する
const customArticle = computed(() =>
  props.page.type === 'custom_page' && isCustomArticlePage(props.page.data) ? customPageAsArticle(props.page.data) : null,
)
const customSinglePage = computed(() =>
  props.page.type === 'custom_page' && isCustomSinglePage(props.page.data) ? customPageAsSinglePage(props.page.data) : null,
)

// 本文として表示する記事・固定ページ(カスタムページを含む。トップ・カスタムページの一覧は null)
const article = computed(() => (props.page.type === 'article' ? props.page.data : customArticle.value))
const singlePage = computed(() => (props.page.type === 'single_page' ? props.page.data : customSinglePage.value))

// 原文枠の固定ページ(呼び出しコンテンツ API の固定ページはビルダーの内容を持たない)にも、表示中の固定ページのビルダーの内容を使う
provide(builderSinglePageKey, computed(() => (singlePage.value?.builder ? singlePage.value : null)))

// サイドバーの位置は、表示するページの種類(カスタムページは記事型を記事・固定ページ型を固定ページ、カスタムページの一覧はその他)で選ぶ
const layoutPageType = computed<LayoutPageType>(() =>
  props.page.type === 'top' ? 'top' : article.value ? 'article' : singlePage.value ? 'single_page' : 'other',
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
  <LayoutSidebarFrame :page-type="layoutPageType" :breadcrumbs="page.breadcrumbs">
    <div>
      <template v-if="page.type === 'top'">
        <TopHero />
        <!-- トップのページビルダー(サイト設定で使う場合)はスライダーの下に表示する -->
        <BuilderRenderer v-if="page.builder" :content="page.builder" />
      </template>
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
