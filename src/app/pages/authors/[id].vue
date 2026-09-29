<script setup lang="ts">
import type { Article, Author, Paginated } from '~/types/api'

// 投稿者ページ(/authors/{ユーザーの id})。プロフィールと、その人の公開中の記事(新しい順、?page=N でページ送り)を表示する。
// プロフィールを公開していない投稿者は 404
const route = useRoute()
const authorId = computed(() => Number(route.params.id))
const page = computed(() => Math.max(Number(route.query.page) || 1, 1))

const { data: authorResponse, error } = await useApi<{ data: Author }>(() => `/authors/${authorId.value}`, {
  key: () => `author:${authorId.value}`,
})
const author = computed(() => authorResponse.value?.data)

if (error.value || !author.value) {
  throw createError({ statusCode: error.value?.statusCode ?? 404, statusMessage: 'Page Not Found', fatal: true })
}

const { data: articles } = await useApi<Paginated<Article>>('/articles', {
  key: () => `author-articles:${authorId.value}:${page.value}`,
  query: computed(() => ({ author: authorId.value, page: page.value })),
})

// ページを移動したら記事の一覧の先頭へ戻る
watch(page, () => {
  if (import.meta.client) {
    document.getElementById('author-articles')?.scrollIntoView()
  }
})

useSeoMeta({
  title: () => `${author.value!.name}の記事`,
  ogTitle: () => `${author.value!.name}の記事`,
  description: () => author.value!.comment ?? undefined,
  ogImage: () => author.value!.user_image_url ?? undefined,
})
</script>

<template>
  <LayoutSidebarFrame
    v-if="author"
    page-type="other"
    :breadcrumbs="[{ label: 'Home', path: '/' }, { label: '投稿者', path: null }, { label: author.name, path: author.profile_path }]"
  >
    <div class="container">
      <div class="row pt-5">
        <SectionHeading title="Author" :subtitle="author.name" />
        <ProfileCard :name="author.name" :image-url="author.user_image_url" :comment="author.comment" :skills="author.skills" />
      </div>

      <div id="author-articles" class="row pb-5">
        <SectionHeading title="Articles" :subtitle="`${author.name}の記事`" />
        <template v-if="articles?.data.length">
          <div v-for="article in articles.data" :key="article.id" class="col-lg-4 py-2 my-2">
            <ArticleCard :article="article" />
          </div>
          <div class="col-lg-12 mt-4">
            <AppPagination :current-page="articles.meta.current_page" :last-page="articles.meta.last_page" />
          </div>
        </template>
        <p v-else class="col-lg-12 text-center text-body-secondary">公開中の記事はまだありません。</p>
      </div>
    </div>
  </LayoutSidebarFrame>
</template>
