<script setup lang="ts">
import type { Article } from '~/types/api'
import type { BuilderNode } from '~/types/builder'

// 記事一覧: biscuit が取得の条件(件数・並び順・投稿先・タグ)どおりに data.articles に入れた公開中の記事を、
// カード(デスクトップは columns 列・タブレットは 2 列・スマートフォンは 1 列)かリストで並べる。記事がなければ何も出さない
const props = defineProps<{
  node: BuilderNode
}>()

const articles = computed(() => (Array.isArray(props.node.data?.articles) ? props.node.data.articles as Article[] : []))
const layout = computed(() => builderEnum(props.node, 'layout', ['card', 'list'] as const, 'card'))
const columns = computed(() => builderInt(props.node, 'columns', 1, 4, 3))
const showExcerpt = computed(() => builderBool(props.node, 'showExcerpt', true))
const showDate = computed(() => builderBool(props.node, 'showDate', true))
</script>

<template>
  <div class="builder-article-list">
    <div v-if="articles.length && layout === 'card'" class="row g-4 row-cols-1 row-cols-md-2" :class="`row-cols-lg-${columns}`">
      <div v-for="article in articles" :key="article.id" class="col">
        <NuxtLink :to="article.path" class="card shadow-sm h-100 text-decoration-none text-reset">
          <img v-if="article.thumbnail_url" :src="article.thumbnail_url" :alt="article.title" class="card-img-top builder-article-thumbnail" loading="lazy">
          <div class="card-body d-flex flex-column">
            <p class="card-title fw-bold mb-2">{{ article.title }}</p>
            <p v-if="showExcerpt" class="card-text small text-body-secondary">{{ excerpt(article.content, 60) }}</p>
            <small v-if="showDate" class="text-body-secondary mt-auto">{{ formatDate(article.published_at) }}</small>
          </div>
        </NuxtLink>
      </div>
    </div>
    <ul v-else-if="articles.length" class="list-unstyled mb-0">
      <li v-for="article in articles" :key="article.id" class="border-bottom py-3">
        <small v-if="showDate" class="text-body-secondary me-3">{{ formatDate(article.published_at) }}</small>
        <NuxtLink :to="article.path" class="fw-bold">{{ article.title }}</NuxtLink>
        <p v-if="showExcerpt" class="small text-body-secondary mb-0 mt-1">{{ excerpt(article.content, 80) }}</p>
      </li>
    </ul>
  </div>
</template>

<style scoped>
.builder-article-thumbnail {
  height: 180px;
  object-fit: cover;
}
</style>
