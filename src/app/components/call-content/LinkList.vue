<script setup lang="ts">
import { NuxtLink } from '#components'
import type { LinkItem } from '~/types/api'

// リンクリスト: 記事・固定ページ・ユーザー詳細を小さな画像付きの一覧で並べる
defineProps<{
  heading: string
  items: LinkItem[]
}>()
</script>

<template>
  <div class="container">
    <div class="row py-5">
      <SectionHeading :title="heading" />
      <div class="col-lg-12">
        <div class="list-group shadow" data-aos="fade-up" data-aos-delay="100">
          <component
            :is="item.path ? NuxtLink : 'div'"
            v-for="item in items"
            :key="item.key"
            :to="item.path ?? undefined"
            class="list-group-item d-flex gap-3 py-3"
            :class="{ 'list-group-item-action': item.path }"
          >
            <img v-if="item.imageUrl" :src="item.imageUrl" :alt="item.title" class="rounded flex-shrink-0 list-image" loading="lazy">
            <div class="d-flex w-100 justify-content-between gap-2">
              <div>
                <h6 class="mb-1">{{ item.title }}</h6>
                <p v-if="item.text" class="mb-0 small text-body-secondary">{{ item.text }}</p>
              </div>
              <small v-if="item.date" class="text-nowrap text-body-secondary">{{ formatDate(item.date) }}</small>
            </div>
          </component>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.list-image {
  width: 64px;
  height: 64px;
  object-fit: cover;
}
</style>
