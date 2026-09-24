<script setup lang="ts">
import type { SinglePage } from '~/types/api'

// 短文: 固定ページの見出し画像・タイトル・概要を並べて紹介する(旧 About セクションのデザイン)
defineProps<{
  title: string | null
  subtitle: string | null
  pages: SinglePage[]
}>()
</script>

<template>
  <div class="container">
    <div class="row py-5">
      <SectionHeading :title="title" :subtitle="subtitle" />
      <div v-for="page in pages" :key="page.id" class="col-lg-12 shadow mb-4" data-aos="fade-up" data-aos-delay="100">
        <div class="row">
          <div v-if="page.header_image_url" class="col-lg-5 px-0">
            <div class="blurBg" :style="{ backgroundImage: `url(${page.header_image_url})` }" />
          </div>
          <div class="my-4" :class="page.header_image_url ? 'col-lg-7' : 'col-lg-12'">
            <h4 class="text-center mb-2 pb-2 font-monospace">{{ page.title }}</h4>
            <p v-if="page.short_sentences" class="m-2 p-2 lh-base">{{ page.short_sentences }}</p>
            <div class="text-end m-2">
              <NuxtLink :to="page.path" class="btn btn-sm btn-outline-secondary">詳しく見る</NuxtLink>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.blurBg {
  width: 100%;
  height: 100%;
  min-height: 34vh;
  background-repeat: no-repeat;
  background-position: center;
  background-size: cover;
  position: relative;
  z-index: 0;
  overflow: hidden;
}
.blurBg:before {
  content: '';
  background: inherit;
  filter: blur(5px);
  position: absolute;
  top: -5px;
  left: -5px;
  right: -5px;
  bottom: -5px;
  z-index: -1;
}
</style>
