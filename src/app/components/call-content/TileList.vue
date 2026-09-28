<script setup lang="ts">
import type { GalleryImage } from '~/types/api'

// タイルリスト: ギャラリー画像をタイル状に並べ、ギャラリーページへ案内する
defineProps<{
  title: string | null
  subtitle: string | null
  images: GalleryImage[]
}>()
</script>

<template>
  <div class="container">
    <div class="row py-5">
      <SectionHeading :title="title" :subtitle="subtitle" />
      <div class="col-lg-12">
        <GalleryTiles :images="images" />
      </div>
      <div class="col-lg-12 text-center mt-4">
        <NuxtLink to="/gallery" class="btn btn-outline-secondary">ギャラリーへ</NuxtLink>
      </div>
    </div>
  </div>
</template>
