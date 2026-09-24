<script setup lang="ts">
// トップのメインビジュアル。サイト設定のタイトル・説明・サイト画像を表示する(画像未設定時は既定の画像)
const { data: siteSetting } = await useSiteSetting()

const siteTitle = computed(() => siteSetting.value?.site_title || 'Chococo Chiffon')
const backgroundImage = computed(() =>
  `url(${siteSetting.value?.site_image_url || '/image/header/ffxiv_20220617_010514_782.png'})`,
)
</script>

<template>
  <section class="header-image d-flex align-items-center" :style="{ backgroundImage }">
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
.header-image {
  width: 100%;
  height: 80vh;
  background-position: center center;
  background-size: cover;
  position: relative;
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
