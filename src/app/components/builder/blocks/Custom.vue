<script setup lang="ts">
import type { BuilderNode } from '~/types/builder'

// 独自コンポーネント: biscuit が data.children に入れた、部品の公開中の内容に差し替えた値(見出しの文字・画像など)を当てはめたブロックを、
// ページのほかのブロックと同じ部品で描く(スタイルは builderCss() が data.children もたどって出す)。中身がなければ何も出さない
const props = defineProps<{
  node: BuilderNode
}>()

const children = computed(() => builderComponentChildren(props.node))

// 中身が自由配置(v2)なら、部品の一番外側が面になる(中のブロックを座標で置く)
const version = builderComponentVersion(props.node)
const isFree = version >= BUILDER_FREE_LAYOUT_VERSION
provide(builderVersionKey, version)
</script>

<template>
  <div class="builder-custom" :class="{ 'builder-free': isFree }">
    <BuilderNodeView v-for="child in children" :key="child.id" :node="child" />
  </div>
</template>
