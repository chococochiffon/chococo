<script setup lang="ts">
// トップのメインビジュアル。サイト設定のトップスライダー画像(16:9)があればそれを切り替えて表示する。
// スライダー画像は文字入りのバナーを想定しているため、タイトル・説明は重ねない。
// 未登録の場合は既定の画像(public/image/header/)を切り替えて、タイトル・説明を重ねて表示する(サイト設定のサイト画像は OGP 用なので使わない)。
// トップにページビルダーを使うときは、ビルダーの内容がサイト名などを出すため、既定の画像とタイトルは出さない(fallback が false)
withDefaults(defineProps<{
  fallback?: boolean
}>(), {
  fallback: true,
})

const { data: siteSetting } = await useSiteSetting()
const defaultSlides = DEFAULT_HEADER_IMAGES.map((imageUrl, index) => ({ id: `default-${index}`, image_url: imageUrl, url: null }))

const siteTitle = computed(() => siteSetting.value?.site_title || 'Chococo Chiffon')
const slides = computed(() => siteSetting.value?.top_slider_images ?? [])
</script>

<template>
  <section v-if="slides.length" class="top-hero-slider-wrap">
    <div class="top-hero top-hero-slider">
      <TopSlider :slides="slides" />
    </div>
  </section>
  <section v-else-if="fallback" class="top-hero top-hero-fallback d-flex align-items-center">
    <TopSlider :slides="defaultSlides" :controls="false" />
    <div class="container top-hero-text f-edging-text" data-aos="zoom-out" data-aos-delay="100">
      <h2>{{ siteTitle }}</h2>
      <p v-if="siteSetting?.description" class="hero-description">{{ siteSetting.description }}</p>
    </div>
  </section>
</template>

<style scoped>
.top-hero {
  position: relative;
  width: 100%;
  aspect-ratio: 16 / 9;
  max-height: 80vh;
  overflow: hidden;
}
/*
 * スライダー画像(16:9)は切り取らずに全体を見せるため、ヘッダーを除いた画面の高さに収まる幅まで縮めて中央に置く。
 * (高さだけを抑えると画像の上下が切れて、ヘッダーの下に隠れたように見える)
 * 縮めたときに左右にできる余白には背景色を敷く。--header-height は layouts/default.vue で設定する
 */
.top-hero-slider-wrap {
  background: #f7f3ee;
}
.top-hero-slider {
  width: min(100%, calc((100svh - var(--header-height, 97px)) * 16 / 9));
  max-height: none;
  margin-inline: auto;
}
/* 既定の画像(2048×768 の JPEG)ではタイトル・説明を重ねるため、小さい画面でも高さを確保する */
.top-hero-fallback {
  aspect-ratio: 8 / 3;
  min-height: 320px;
}
.top-hero-text {
  position: relative;
  z-index: 1;
}
.hero-description {
  font-size: 1rem;
  max-width: 40em;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 3;
  line-clamp: 3;
  overflow: hidden;
}
</style>
