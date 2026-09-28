<script setup lang="ts">
import type { GalleryImage } from '~/types/api'

// ギャラリー(biscuit のギャラリー画像を並び順にすべて並べる)。分類のボタンで絞り込める
const [{ data: images, error: imagesError }, { data: allCategories, error: categoriesError }] = await Promise.all([
  useGalleryImages(),
  useGalleryCategories(),
])

const error = imagesError.value ?? categoriesError.value
if (error) {
  throw createError({ statusCode: error.statusCode ?? 500, statusMessage: 'Server Error', fatal: true })
}

// 画像がある分類だけを、分類の並び順で切り替えボタンにする
const categories = computed(() =>
  (allCategories.value ?? []).filter(category => (images.value ?? []).some(image => image.category?.id === category.id)),
)

// 選んでいる分類(null はすべて)
const selectedCategoryId = ref<number | null>(null)

const filteredImages = computed<GalleryImage[]>(() =>
  (images.value ?? []).filter(image => selectedCategoryId.value === null || image.category?.id === selectedCategoryId.value),
)

useSeoMeta({
  title: 'Gallery',
  ogTitle: 'Gallery',
})
</script>

<template>
  <div class="container">
    <div class="row py-5">
      <SectionHeading title="Gallery" subtitle="ギャラリー" />
      <div v-if="categories.length" class="col-lg-12 d-flex flex-wrap justify-content-center gap-2 mb-4" role="group" aria-label="分類で絞り込む">
        <button
          type="button"
          class="btn btn-sm rounded-pill"
          :class="selectedCategoryId === null ? 'btn-secondary' : 'btn-outline-secondary'"
          :aria-pressed="selectedCategoryId === null"
          @click="selectedCategoryId = null"
        >
          すべて
        </button>
        <button
          v-for="category in categories"
          :key="category.id"
          type="button"
          class="btn btn-sm rounded-pill"
          :class="selectedCategoryId === category.id ? 'btn-secondary' : 'btn-outline-secondary'"
          :aria-pressed="selectedCategoryId === category.id"
          @click="selectedCategoryId = category.id"
        >
          {{ category.name }}
        </button>
      </div>
      <div v-if="filteredImages.length" class="col-lg-12">
        <GalleryTiles :key="selectedCategoryId ?? 'all'" :images="filteredImages" />
      </div>
      <p v-else class="col-lg-12 text-center text-body-secondary">ギャラリーの画像はまだありません。</p>
    </div>
  </div>
</template>
