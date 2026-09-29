<script setup lang="ts">
import type { LayoutBlock, LayoutRegion } from '~/types/api'

// ナビメニュー: Home・固定ページ(リンクリスト表示対象)・記事一覧・カスタムページの種類の一覧・ギャラリー・FAQ へのリンクを並べる。
// ヘッダーではスマホ表示で開閉するメニュー、それ以外の領域ではリンクの一覧にする
const props = defineProps<{
  block: Extract<LayoutBlock, { block_type: 'nav_menu' }>
  region: LayoutRegion
}>()

interface NavItem {
  key: string
  label: string
  to: string
  // 一覧(/recipes)の下の各ページ(/recipes/xxx)を開いているときも選択中にする
  prefix?: boolean
}

const items = computed<NavItem[]>(() => [
  { key: 'home', label: 'Home', to: '/' },
  ...props.block.single_pages.map(page => ({ key: `page-${page.id}`, label: page.title, to: page.path })),
  { key: 'articles', label: 'Articles', to: '/articles' },
  ...props.block.custom_page_types.map(type => ({ key: `custom-${type.name}`, label: type.label, to: type.path, prefix: true })),
  { key: 'gallery', label: 'Gallery', to: '/gallery' },
  { key: 'faq', label: 'FAQ', to: '/faq' },
])

const route = useRoute()
const isActive = (item: NavItem) => route.path === item.to || (item.prefix === true && route.path.startsWith(`${item.to}/`))

// ページを移動したら、スマホ表示で開いたメニューを閉じる
const isOpen = ref(false)
watch(() => route.fullPath, () => {
  isOpen.value = false
})
</script>

<template>
  <template v-if="region === 'header'">
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
        <li v-for="item in items" :key="item.key" class="nav-item">
          <NuxtLink :to="item.to" class="nav-link" :class="{ active: isActive(item) }">{{ item.label }}</NuxtLink>
        </li>
      </ul>
    </div>
  </template>
  <ul v-else class="list-unstyled small mb-0" :class="{ 'd-flex flex-wrap gap-3': region === 'footer' }">
    <li v-for="item in items" :key="item.key" :class="{ 'mb-1': region !== 'footer' }">
      <NuxtLink :to="item.to" class="link-secondary" :class="{ 'fw-bold': isActive(item) }">{{ item.label }}</NuxtLink>
    </li>
  </ul>
</template>
