<script setup lang="ts">
import type { SinglePage } from '~/types/api'

// 固定ページの本文(見出し画像・タイトル・概要と、並び順どおりの詳細)
defineProps<{
  page: SinglePage
}>()
</script>

<template>
  <article>
    <section
      v-if="page.header_image_url"
      class="page-header d-flex align-items-center"
      :style="{ backgroundImage: `url(${page.header_image_url})` }"
    >
      <div class="container f-edging-text" data-aos="zoom-out" data-aos-delay="100">
        <h1 class="fs-2 fw-bold">{{ page.title }}</h1>
      </div>
    </section>
    <div class="container py-5">
      <header v-if="!page.header_image_url || page.short_sentences" class="mb-4 text-center">
        <h1 v-if="!page.header_image_url" class="fw-bold font-monospace fs-2">
          <span class="underline">{{ page.title }}</span>
        </h1>
        <p v-if="page.short_sentences" class="lead mt-3">{{ page.short_sentences }}</p>
      </header>
      <section
        v-for="detail in page.details"
        :key="detail.id"
        class="shadow rounded p-4 mb-4"
        data-aos="fade-up"
        data-aos-delay="100"
      >
        <h2 v-if="detail.sub_title" class="fs-4 font-monospace mb-3">{{ detail.sub_title }}</h2>
        <!-- 詳細は管理画面のリッチテキストエディタ(Quill)で作成した HTML -->
        <div class="rich-content" v-html="detail.contents" />
      </section>
    </div>
  </article>
</template>

<style scoped>
.page-header {
  width: 100%;
  height: 40vh;
  background-position: center center;
  background-size: cover;
}
</style>
