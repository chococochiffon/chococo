<script setup lang="ts">
import type { GalleryImage } from '~/types/api'
import type { BuilderNode } from '~/types/builder'

// ギャラリー: biscuit が取得の条件(分類・件数)どおりに data.images に入れた公開中の画像を、ギャラリーページと同じタイル
// (クリックで拡大表示)で並べる。列数・名前を出すかはブロックの設定どおり。画像が 1 枚もなければ見本の画像を並べる
const props = defineProps<{
  node: BuilderNode
}>()

const images = computed(() => {
  const registered = Array.isArray(props.node.data?.images) ? props.node.data.images as GalleryImage[] : []

  return registered.length ? registered : SAMPLE_GALLERY_IMAGES
})
const columns = computed(() => builderInt(props.node, 'columns', 2, 6, 4))
const showCaption = computed(() => builderBool(props.node, 'showCaption', true))
</script>

<template>
  <div class="builder-gallery">
    <GalleryTiles :images="images" :columns="columns" :show-caption="showCaption" />
  </div>
</template>
