<script setup lang="ts">
import type { TopSliderImage } from '~/types/api'

// トップのスライダー。画像をフェードで自動的に切り替え、前後ボタン・インジケーターでも切り替えられる。
// リンク先 URL がある画像はクリックでそのページへ移動する
const props = defineProps<{
  slides: TopSliderImage[]
}>()

// 自動で切り替える間隔(ミリ秒)
const INTERVAL = 5000

const current = ref(0)
let timer: ReturnType<typeof setInterval> | undefined

function show(index: number) {
  const count = props.slides.length
  current.value = (index + count) % count
}

function stop() {
  clearInterval(timer)
  timer = undefined
}

// 画像が2枚以上あり、視差効果を減らす設定になっていない場合だけ自動で切り替える
function start() {
  stop()
  if (props.slides.length < 2 || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
  timer = setInterval(() => show(current.value + 1), INTERVAL)
}

// 手動で切り替えたときは、その画像から改めて間隔を数え直す
function select(index: number) {
  show(index)
  start()
}

onMounted(start)
onBeforeUnmount(stop)
</script>

<template>
  <div
    class="top-slider"
    role="region"
    aria-roledescription="carousel"
    aria-label="トップスライダー"
    @mouseenter="stop"
    @mouseleave="start"
    @focusin="stop"
    @focusout="start"
  >
    <div
      v-for="(slide, index) in slides"
      :key="slide.id"
      class="top-slider-item"
      :class="{ active: index === current }"
      role="group"
      aria-roledescription="slide"
      :aria-label="`${index + 1} / ${slides.length}`"
      :aria-hidden="index !== current"
    >
      <a v-if="slide.url" :href="slide.url" class="d-block h-100" :tabindex="index === current ? 0 : -1">
        <img :src="slide.image_url" alt="" class="top-slider-image" :loading="index === 0 ? 'eager' : 'lazy'">
      </a>
      <img v-else :src="slide.image_url" alt="" class="top-slider-image" :loading="index === 0 ? 'eager' : 'lazy'">
    </div>

    <template v-if="slides.length > 1">
      <button type="button" class="top-slider-control top-slider-control-prev" aria-label="前の画像" @click="select(current - 1)">
        <i class="bi bi-chevron-left" aria-hidden="true" />
      </button>
      <button type="button" class="top-slider-control top-slider-control-next" aria-label="次の画像" @click="select(current + 1)">
        <i class="bi bi-chevron-right" aria-hidden="true" />
      </button>
      <div class="top-slider-indicators">
        <button
          v-for="(slide, index) in slides"
          :key="slide.id"
          type="button"
          :class="{ active: index === current }"
          :aria-label="`${index + 1}枚目の画像`"
          :aria-current="index === current"
          @click="select(index)"
        />
      </div>
    </template>
  </div>
</template>

<style scoped>
.top-slider {
  position: absolute;
  inset: 0;
  overflow: hidden;
}
.top-slider-item {
  position: absolute;
  inset: 0;
  opacity: 0;
  visibility: hidden;
  transition: opacity 0.8s ease, visibility 0.8s;
}
.top-slider-item.active {
  opacity: 1;
  visibility: visible;
}
.top-slider-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
.top-slider-control {
  position: absolute;
  top: 50%;
  z-index: 2;
  transform: translateY(-50%);
  width: 2.75rem;
  height: 2.75rem;
  border: 0;
  border-radius: 50%;
  background: rgba(0, 0, 0, 0.3);
  color: #fff;
  font-size: 1.25rem;
  transition: background 0.2s;
}
.top-slider-control:hover,
.top-slider-control:focus-visible {
  background: rgba(0, 0, 0, 0.5);
}
.top-slider-control-prev {
  left: 1rem;
}
.top-slider-control-next {
  right: 1rem;
}
@media (max-width: 575.98px) {
  .top-slider-control {
    width: 2rem;
    height: 2rem;
    font-size: 1rem;
  }
  .top-slider-control-prev {
    left: 0.5rem;
  }
  .top-slider-control-next {
    right: 0.5rem;
  }
  .top-slider-indicators {
    bottom: 0.5rem;
  }
}
.top-slider-indicators {
  position: absolute;
  bottom: 1rem;
  left: 50%;
  z-index: 2;
  display: flex;
  gap: 0.5rem;
  transform: translateX(-50%);
}
.top-slider-indicators button {
  width: 2rem;
  height: 0.25rem;
  padding: 0;
  border: 0;
  background: rgba(255, 255, 255, 0.5);
  box-shadow: 0 0 3px rgba(0, 0, 0, 0.4);
  transition: background 0.2s;
}
.top-slider-indicators button.active {
  background: #fff;
}
@media (prefers-reduced-motion: reduce) {
  .top-slider-item {
    transition: none;
  }
}
</style>
