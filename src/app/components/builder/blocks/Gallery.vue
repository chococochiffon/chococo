<script setup lang="ts">
import type { GalleryImage } from '~/types/api'
import type { BuilderNode } from '~/types/builder'

// ギャラリー: biscuit が取得の条件(分類・件数)どおりに data.images に入れた公開中の画像を、ギャラリーページと同じタイル
// (クリックで拡大表示)で並べる。列数・名前を出すかはブロックの設定どおり。画像がなければ何も出さない
const props = defineProps<{
  node: BuilderNode
}>()

const images = computed(() => (Array.isArray(props.node.data?.images) ? props.node.data.images as GalleryImage[] : []))
const columns = computed(() => builderInt(props.node, 'columns', 2, 6, 4))
const showCaption = computed(() => builderBool(props.node, 'showCaption', true))
</script>

<template>
  <div class="builder-gallery">
    <GalleryTiles v-if="images.length" :images="images" :columns="columns" :show-caption="showCaption" />
  </div>
</template>
