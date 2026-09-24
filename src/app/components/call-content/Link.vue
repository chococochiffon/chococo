<script setup lang="ts">
import type { LinkItem } from '~/types/api'

// リンク: 1件の記事・固定ページを画像付きの横長カードで案内する
defineProps<{
  title: string | null
  subtitle: string | null
  item: LinkItem
}>()
</script>

<template>
  <div class="container">
    <div class="row py-5">
      <SectionHeading :title="title" :subtitle="subtitle" />
      <div class="col-lg-12">
        <div class="card shadow overflow-hidden" data-aos="fade-up" data-aos-delay="100">
          <div class="row g-0">
            <div v-if="item.imageUrl" class="col-md-4">
              <img :src="item.imageUrl" :alt="item.title" class="link-image" loading="lazy">
            </div>
            <div :class="item.imageUrl ? 'col-md-8' : 'col-md-12'">
              <div class="card-body h-100 d-flex flex-column">
                <h4 class="card-title font-monospace">{{ item.title }}</h4>
                <p v-if="item.text" class="card-text">{{ item.text }}</p>
                <div class="d-flex justify-content-between align-items-center mt-auto">
                  <small class="text-body-secondary">{{ formatDate(item.date) }}</small>
                  <NuxtLink v-if="item.path" :to="item.path" class="btn btn-sm btn-outline-secondary">詳しく見る</NuxtLink>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.link-image {
  width: 100%;
  height: 100%;
  min-height: 200px;
  object-fit: cover;
}
</style>
