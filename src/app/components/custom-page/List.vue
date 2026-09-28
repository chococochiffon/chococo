<script setup lang="ts">
import type { CustomPage, CustomPageType, Paginated } from '~/types/api'

// カスタムページの種類ごとの一覧(?page=N でページ送り)。記事型は記事一覧と同じカード、固定ページ型は短文と同じ紹介で並べる
const props = defineProps<{
  customPageType: CustomPageType
}>()

const route = useRoute()
const page = computed(() => Math.max(Number(route.query.page) || 1, 1))

const { data: customPages, error } = await useApi<Paginated<CustomPage>>(`/custom-pages/${props.customPageType.name}`, {
  key: () => `custom-pages:${props.customPageType.name}:${page.value}`,
  query: computed(() => ({ page: page.value })),
})

if (error.value) {
  throw createError({ statusCode: error.value.statusCode ?? 500, statusMessage: 'Server Error', fatal: true })
}

const articles = computed(() => (customPages.value?.data ?? []).filter(isCustomArticlePage).map(customPageAsArticle))
const singlePages = computed(() => (customPages.value?.data ?? []).filter(isCustomSinglePage).map(customPageAsSinglePage))

// ページを移動したら一覧の先頭へ戻る
watch(page, () => {
  if (import.meta.client) {
    window.scrollTo({ top: 0 })
  }
})

useSeoMeta({
  title: () => (page.value > 1 ? `${props.customPageType.label}(${page.value}ページ目)` : props.customPageType.label),
  ogTitle: () => props.customPageType.label,
})
</script>

<template>
  <div v-if="customPages?.data.length">
    <div v-if="customPageType.base_type === 'article'" class="container">
      <div class="row py-5">
        <SectionHeading :title="customPageType.label" />
        <div v-for="article in articles" :key="article.id" class="col-lg-4 py-2 my-2">
          <ArticleCard :article="article" />
        </div>
      </div>
    </div>
    <CallContentShortSentence v-else :title="customPageType.label" :subtitle="null" :pages="singlePages" />
    <div class="container pb-5">
      <AppPagination :current-page="customPages.meta.current_page" :last-page="customPages.meta.last_page" />
    </div>
  </div>
  <div v-else class="container">
    <div class="row py-5">
      <SectionHeading :title="customPageType.label" />
      <p class="col-lg-12 text-center text-body-secondary">{{ customPageType.label }}はまだありません。</p>
    </div>
  </div>
</template>
