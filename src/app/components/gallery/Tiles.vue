<script setup lang="ts">
import type { GalleryImage } from '~/types/api'

// ギャラリー画像を正方形のタイルで並べ、クリックすると拡大表示(名前・コメント付き)する。トップのタイルリスト・ギャラリーページ・ページビルダーのギャラリーのブロックで使う。
// 列数はスマートフォン 2・タブレット 3(columns が 3 より少なければ columns)・デスクトップ columns(既定 4)。showCaption が false ならタイルに名前を重ねない
const props = withDefaults(defineProps<{
  images: GalleryImage[]
  columns?: number
  showCaption?: boolean
}>(), {
  columns: 4,
  showCaption: true,
})

const rowClass = computed(() => `row-cols-md-${Math.min(3, props.columns)} row-cols-lg-${props.columns}`)

// 拡大表示中の画像(閉じているときは null)
const selected = ref<GalleryImage | null>(null)

function close() {
  selected.value = null
}

function onKeydown(event: KeyboardEvent) {
  if (event.key === 'Escape') {
    close()
  }
}

onMounted(() => window.addEventListener('keydown', onKeydown))
onBeforeUnmount(() => window.removeEventListener('keydown', onKeydown))
</script>

<template>
  <div class="row g-2 g-md-3 row-cols-2" :class="rowClass">
    <div v-for="image in images" :key="image.id" class="col" data-aos="fade-up" data-aos-delay="100">
      <button type="button" class="tile shadow-sm rounded" :aria-label="`${image.name}を拡大表示`" @click="selected = image">
        <img :src="image.image_url" :alt="image.name" class="tile-image" loading="lazy">
        <span v-if="showCaption" class="tile-caption">{{ image.name }}</span>
      </button>
    </div>
  </div>

  <Teleport to="body">
    <div
      v-if="selected"
      class="lightbox"
      role="dialog"
      aria-modal="true"
      :aria-label="selected.name"
      @click.self="close"
    >
      <figure class="lightbox-figure bg-white rounded shadow">
        <button type="button" class="btn-close lightbox-close" aria-label="閉じる" @click="close" />
        <img :src="selected.image_url" :alt="selected.name" class="lightbox-image rounded-top">
        <figcaption class="p-3">
          <p class="fw-bold mb-1">{{ selected.name }}</p>
          <p v-if="selected.comment" class="mb-1 small">{{ selected.comment }}</p>
          <span v-if="selected.category" class="badge rounded-pill text-bg-light border">{{ selected.category.name }}</span>
        </figcaption>
      </figure>
    </div>
  </Teleport>
</template>

<style scoped>
.tile {
  position: relative;
  display: block;
  width: 100%;
  aspect-ratio: 1;
  padding: 0;
  overflow: hidden;
  border: 0;
  background: none;
}
.tile-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform .3s;
}
.tile:hover .tile-image,
.tile:focus-visible .tile-image {
  transform: scale(1.05);
}
.tile-caption {
  position: absolute;
  inset: auto 0 0;
  padding: .25rem .5rem;
  overflow: hidden;
  font-size: .8rem;
  color: #fff;
  text-align: left;
  text-overflow: ellipsis;
  white-space: nowrap;
  background: linear-gradient(transparent, rgba(0, 0, 0, .55));
}
.lightbox {
  position: fixed;
  inset: 0;
  z-index: 1080;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem;
  background: rgba(0, 0, 0, .7);
}
.lightbox-figure {
  position: relative;
  max-width: min(900px, 100%);
  max-height: 100%;
  margin: 0;
  overflow: auto;
}
.lightbox-image {
  display: block;
  max-width: 100%;
  max-height: 75vh;
  margin: 0 auto;
}
.lightbox-close {
  position: absolute;
  top: .5rem;
  right: .5rem;
  padding: .5rem;
  background-color: #fff;
  border-radius: 50%;
  opacity: .9;
}
</style>
