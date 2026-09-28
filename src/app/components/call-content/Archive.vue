<script setup lang="ts">
import type { Article } from '~/types/api'

// アーカイブ: 記事をサムネイル付きのカードで並べ、一覧ページ(記事一覧、記事型のカスタムページは種類の一覧)へ案内する(旧 Contents セクションのデザイン)
withDefaults(defineProps<{
  title: string | null
  subtitle: string | null
  articles: Article[]
  listPath?: string
  listLabel?: string
}>(), {
  listPath: '/articles',
  listLabel: '記事一覧へ',
})
</script>

<template>
  <div class="container">
    <div class="row py-5">
      <SectionHeading :title="title" :subtitle="subtitle" />
      <div v-for="(article, index) in articles" :key="article.id" class="col-lg-4 py-2 my-2">
        <ArticleCard :article="article" :aos="index % 2 === 0 ? 'fade-down' : 'fade-up'" />
      </div>
      <div class="col-lg-12 text-center mt-3">
        <NuxtLink :to="listPath" class="btn btn-outline-secondary">{{ listLabel }}</NuxtLink>
      </div>
    </div>
  </div>
</template>
