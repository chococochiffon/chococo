<script setup lang="ts">
import type { Article, Paginated } from '~/types/api'

// 記事一覧(新しい順、?page=N でページ送り)。/articles だけに一致し、/articles/xxx の記事は [...slug].vue が表示する
const route = useRoute()
const page = computed(() => Math.max(Number(route.query.page) || 1, 1))

const { data: articles, error } = await useApi<Paginated<Article>>('/articles', {
  key: () => `articles:${page.value}`,
  query: computed(() => ({ page: page.value })),
})

if (error.value) {
  throw createError({ statusCode: error.value.statusCode ?? 500, statusMessage: 'Server Error', fatal: true })
}

// ページを移動したら一覧の先頭へ戻る
watch(page, () => {
  if (import.meta.client) {
    window.scrollTo({ top: 0 })
  }
})

useSeoMeta({
  title: () => (page.value > 1 ? `記事一覧(${page.value}ページ目)` : '記事一覧'),
  ogTitle: '記事一覧',
})
</script>

<template>
  <div class="container">
    <div class="row py-5">
      <SectionHeading title="Articles" subtitle="記事一覧" />
      <template v-if="articles?.data.length">
        <div v-for="article in articles.data" :key="article.id" class="col-lg-4 py-2 my-2">
          <ArticleCard :article="article" />
        </div>
        <div class="col-lg-12 mt-4">
          <AppPagination :current-page="articles.meta.current_page" :last-page="articles.meta.last_page" />
        </div>
      </template>
      <p v-else class="col-lg-12 text-center text-body-secondary">記事はまだありません。</p>
    </div>
  </div>
</template>
