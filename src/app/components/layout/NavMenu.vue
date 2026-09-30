<script setup lang="ts">
import type { LayoutBlock, LayoutRegion, NavMenuItem } from '~/types/api'

// ナビメニュー: biscuit のレイアウト管理で登録した項目(未登録なら biscuit が自動で並べた項目)へのリンクを並べる。
// ヘッダーではスマホ表示で開閉するメニュー、それ以外の領域ではリンクの一覧にする
defineProps<{
  block: Extract<LayoutBlock, { block_type: 'nav_menu' }>
  region: LayoutRegion
}>()

const route = useRoute()
const isActive = (item: NavMenuItem) => route.path === item.path || (item.prefix && route.path.startsWith(`${item.path}/`))

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
      <ul class="nav navbar-nav ms-auto mb-2 mb-md-0">
        <li v-for="(item, index) in block.items" :key="index" class="nav-item">
          <NuxtLink :to="item.path" class="nav-link" :class="{ active: isActive(item) }">{{ item.label }}</NuxtLink>
        </li>
      </ul>
    </div>
  </template>
  <ul v-else class="list-unstyled small mb-0" :class="{ 'd-flex flex-wrap gap-3': region === 'footer' }">
    <li v-for="(item, index) in block.items" :key="index" :class="{ 'mb-1': region !== 'footer' }">
      <NuxtLink :to="item.path" class="link-secondary" :class="{ 'fw-bold': isActive(item) }">{{ item.label }}</NuxtLink>
    </li>
  </ul>
</template>
