<script setup lang="ts">
// トップのメインビジュアル。サイト設定のトップスライダー画像(16:9)があればそれを切り替えて表示する。
// スライダー画像は文字入りのバナーを想定しているため、タイトル・説明は重ねない。
// 未登録の場合は既定の画像にタイトル・説明を重ねて表示する(サイト設定のサイト画像は OGP 用なので使わない)
const { data: siteSetting } = await useSiteSetting()

const siteTitle = computed(() => siteSetting.value?.site_title || 'Chococo Chiffon')
const slides = computed(() => siteSetting.value?.top_slider_images ?? [])
</script>

<template>
  <section v-if="slides.length" class="top-hero">
    <TopSlider :slides="slides" />
  </section>
  <section v-else class="top-hero top-hero-fallback d-flex align-items-center">
    <div class="container f-edging-text" data-aos="zoom-out" data-aos-delay="100">
      <h2>{{ siteTitle }}</h2>
      <p v-if="siteSetting?.description" class="hero-description">{{ siteSetting.description }}</p>
      <div class="d-flex">
        <a href="#contents" class="btn-get-started">Get Started</a>
      </div>
    </div>
  </section>
</template>

<style scoped>
/* 16:9 の画像全体が見えるよう幅に合わせて高さを決め、大きな画面では画面の高さの8割までに収める */
.top-hero {
  position: relative;
  width: 100%;
  aspect-ratio: 16 / 9;
  max-height: 80vh;
  overflow: hidden;
}
/* 既定の画像ではタイトル・説明を重ねるため、小さい画面でも高さを確保する */
.top-hero-fallback {
  min-height: 320px;
  background: url('/image/header/ffxiv_20220617_010514_782.png') center center / cover;
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
.btn-get-started {
  color: #ff6800;
  text-decoration: none;
}
</style>
