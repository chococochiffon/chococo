<script setup lang="ts">
import type { SinglePage } from '~/types/api'

// ナビには、共通部品(その他)の呼び出しコンテンツのうち固定ページのリンクを並べる
const { data: siteSetting } = await useSiteSetting()
const { data: commonCallContents } = await useCommonCallContents()

const siteTitle = computed(() => siteSetting.value?.site_title || 'Chococo Chiffon')

const navPages = computed<SinglePage[]>(() =>
  (commonCallContents.value ?? [])
    .filter(callContent => callContent.call_type === 'link_list' || callContent.call_type === 'link')
    .map(callContentItems)
    .flatMap(content => (content.kind === 'single_pages' ? content.items : [])),
)

// ページを移動したら、スマホ表示で開いたメニューを閉じる
const isOpen = ref(false)
const route = useRoute()
watch(() => route.fullPath, () => {
  isOpen.value = false
})
</script>

<template>
  <section class="d-flex align-items-center border-bottom nav-bg-color">
    <div class="container">
      <div class="py-1 mb-4">
        <!-- nav start -->
        <nav class="navbar navbar-light navbar-expand-md">
          <div class="container-fluid">
            <NuxtLink to="/" class="navbar-brand d-flex align-items-center mb-3 mb-md-0 me-md-auto link-body-emphasis text-decoration-none">
              <span class="fs-4">{{ siteTitle }}</span>
            </NuxtLink>
            <button
              class="navbar-toggler"
              type="button"
              aria-controls="navbar"
              :aria-expanded="isOpen"
              aria-label="navbar"
              @click="isOpen = !isOpen"
            >
              <span class="navbar-toggler-icon" />
            </button>
            <div id="navbar" class="collapse navbar-collapse" :class="{ show: isOpen }">
              <ul class="nav navbar-nav ms-auto mb-2">
                <li class="nav-item">
                  <NuxtLink to="/" class="nav-link" exact-active-class="active">Home</NuxtLink>
                </li>
                <li v-for="page in navPages" :key="page.id" class="nav-item">
                  <NuxtLink :to="page.path" class="nav-link" active-class="active">{{ page.title }}</NuxtLink>
                </li>
                <li class="nav-item">
                  <NuxtLink to="/faq" class="nav-link" active-class="active">FAQ</NuxtLink>
                </li>
              </ul>
            </div>
          </div>
        </nav>
        <!-- nav end -->
      </div>
    </div>
  </section>
</template>
