<script setup lang="ts">
import type { Article } from '~/types/api'

// アーカイブ: 記事をサムネイル付きのカードで並べ、記事一覧ページへ案内する(旧 Contents セクションのデザイン)
defineProps<{
  title: string | null
  subtitle: string | null
  articles: Article[]
}>()
</script>

<template>
  <div class="container">
    <div class="row py-5">
      <SectionHeading :title="title" :subtitle="subtitle" />
      <div v-for="(article, index) in articles" :key="article.id" class="col-lg-4 py-2 my-2">
        <ArticleCard :article="article" :aos="index % 2 === 0 ? 'fade-down' : 'fade-up'" />
      </div>
      <div class="col-lg-12 text-center mt-3">
        <NuxtLink to="/articles" class="btn btn-outline-secondary">記事一覧へ</NuxtLink>
      </div>
    </div>
  </div>
</template>
