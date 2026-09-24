<script setup lang="ts">
import type { Article } from '~/types/api'

// 記事の本文(タイトル・公開日・投稿者・タグ・サムネイル・本文)
defineProps<{
  article: Article
}>()
</script>

<template>
  <article class="container py-5">
    <header class="mb-4 text-center">
      <h1 class="fw-bold font-monospace fs-2">
        <span class="underline">{{ article.title }}</span>
      </h1>
      <p class="text-body-secondary small mt-3 mb-2">
        <span v-if="article.published_at"><i class="bi bi-calendar3 me-1" />{{ formatDate(article.published_at) }}</span>
        <span v-if="article.author_name" class="ms-3"><i class="bi bi-person me-1" />{{ article.author_name }}</span>
      </p>
      <div v-if="article.tags?.length" class="d-flex flex-wrap justify-content-center gap-1">
        <span v-for="tag in article.tags" :key="tag.id" class="badge rounded-pill text-bg-light border">#{{ tag.name }}</span>
      </div>
    </header>
    <img v-if="article.thumbnail_url" :src="article.thumbnail_url" :alt="article.title" class="img-fluid rounded shadow mb-4 d-block mx-auto">
    <!-- 本文は管理画面のリッチテキストエディタ(Quill)で作成した HTML -->
    <div class="rich-content" v-html="article.content" />
  </article>
</template>
