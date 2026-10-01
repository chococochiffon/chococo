<script setup lang="ts">
import type { BuilderNode } from '~/types/builder'

// パンくず: 表示しているページのパンくず(パス解決 API の breadcrumbs。PageResolved が渡す)を、ブロックの見た目
// (区切り・今のページを出すか・揃え)で並べる。トップなどパンくずのないページでは何も出さない。
// 検索エンジン向けの構造化データ(BreadcrumbList)はレイアウトのパンくず(AppBreadcrumbs)が出すため、ここでは出さない
const props = defineProps<{
  node: BuilderNode
}>()

const breadcrumbs = inject(builderBreadcrumbsKey, null)

const SEPARATORS = { slash: '/', chevron: '›', arrow: '→' } as const

const showCurrent = computed(() => builderBool(props.node, 'showCurrent', true))
const all = computed(() => breadcrumbs?.value ?? [])
const items = computed(() => (showCurrent.value ? all.value : all.value.slice(0, -1)))
const separator = computed(() => `'${SEPARATORS[builderEnum(props.node, 'separator', ['slash', 'chevron', 'arrow'] as const, 'slash')]}'`)
const align = computed(() => builderEnum(props.node, 'align', ['start', 'center', 'end'] as const, 'start'))
const isCurrent = (index: number) => index === all.value.length - 1
</script>

<template>
  <nav v-if="all.length > 1" aria-label="breadcrumb" class="builder-breadcrumb">
    <ol
      class="breadcrumb mb-0"
      :class="align === 'start' ? '' : `justify-content-${align}`"
      :style="{ '--bs-breadcrumb-divider': separator }"
    >
      <li
        v-for="(item, index) in items"
        :key="index"
        class="breadcrumb-item"
        :class="{ active: isCurrent(index) }"
        :aria-current="isCurrent(index) ? 'page' : undefined"
      >
        <NuxtLink v-if="item.path && !isCurrent(index)" :to="item.path" class="link-secondary">{{ item.label }}</NuxtLink>
        <template v-else>{{ item.label }}</template>
      </li>
    </ol>
  </nav>
</template>
