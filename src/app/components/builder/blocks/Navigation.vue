<script setup lang="ts">
import type { NavMenuItem } from '~/types/api'
import type { BuilderNode } from '~/types/builder'

// ナビゲーション: biscuit が data.items に入れた項目(サイトのナビメニューか、リンクリストに表示する固定ページ)へのリンクを、
// Bootstrap の nav で並べる(横・縦、リンク・ピル・下線、揃え)。表示中のページ(prefix の項目は下の階層も)は選択中にする
const props = defineProps<{
  node: BuilderNode
}>()

const route = useRoute()

const items = computed(() => (Array.isArray(props.node.data?.items) ? props.node.data.items as NavMenuItem[] : []))
const direction = computed(() => builderEnum(props.node, 'direction', ['horizontal', 'vertical'] as const, 'horizontal'))
const variant = computed(() => builderEnum(props.node, 'variant', ['links', 'pills', 'underline'] as const, 'links'))
const align = computed(() => builderEnum(props.node, 'align', ['start', 'center', 'end'] as const, 'start'))

const navClass = computed(() => [
  variant.value === 'links' ? '' : `nav-${variant.value}`,
  direction.value === 'vertical' ? 'flex-column' : '',
  align.value === 'start' ? '' : `justify-content-${align.value}`,
])

const isActive = (item: NavMenuItem) => route.path === item.path || (item.prefix && route.path.startsWith(`${item.path}/`))
</script>

<template>
  <nav class="builder-navigation">
    <ul v-if="items.length" class="nav" :class="navClass">
      <li v-for="(item, index) in items" :key="index" class="nav-item">
        <NuxtLink :to="item.path" class="nav-link" :class="{ active: isActive(item) }" :aria-current="isActive(item) ? 'page' : undefined">
          {{ item.label }}
        </NuxtLink>
      </li>
    </ul>
  </nav>
</template>
