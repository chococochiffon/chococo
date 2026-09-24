<script setup lang="ts">
import type { Article } from '~/types/api'

// アーカイブ: 記事をサムネイル付きのカードで並べる(旧 Contents セクションのデザイン)
defineProps<{
  heading: string
  articles: Article[]
}>()
</script>

<template>
  <div class="container">
    <div class="row py-5">
      <SectionHeading :title="heading" subtitle="活動の記録や実績" />
      <div v-for="(article, index) in articles" :key="article.id" class="col-lg-4 py-2 my-2">
        <div class="card shadow h-100" :data-aos="index % 2 === 0 ? 'fade-down' : 'fade-up'" data-aos-delay="100">
          <img
            v-if="article.thumbnail_url"
            :src="article.thumbnail_url"
            :alt="article.title"
            class="card-img-top card-thumbnail"
            loading="lazy"
          >
          <svg v-else class="bd-placeholder-img card-img-top" width="100%" height="200" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="No Image" preserveAspectRatio="xMidYMid slice" focusable="false">
            <rect width="100%" height="100%" fill="#55595c" />
            <text x="50%" y="50%" fill="#eceeef" dy=".3em">No Image</text>
          </svg>
          <div class="card-body d-flex flex-column">
            <p class="card-text">{{ article.title }}</p>
            <div class="d-flex justify-content-between align-items-center mt-auto">
              <div class="btn-group">
                <NuxtLink :to="article.path" class="btn btn-sm btn-outline-secondary">View</NuxtLink>
              </div>
              <small class="text-body-secondary">{{ formatDate(article.published_at) }}</small>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.card-thumbnail {
  height: 200px;
  object-fit: cover;
}
</style>
