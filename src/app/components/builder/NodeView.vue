<script setup lang="ts">
import type { Component } from 'vue'
import type { BuilderNode } from '~/types/builder'
import BuilderSection from './blocks/Section.vue'
import BuilderContainer from './blocks/Container.vue'
import BuilderRow from './blocks/Row.vue'
import BuilderColumn from './blocks/Column.vue'
import BuilderHeading from './blocks/Heading.vue'
import BuilderText from './blocks/Text.vue'
import BuilderImage from './blocks/Image.vue'
import BuilderButton from './blocks/Button.vue'
import BuilderSpacer from './blocks/Spacer.vue'
import BuilderDivider from './blocks/Divider.vue'
import BuilderArticleList from './blocks/ArticleList.vue'
import BuilderNavigation from './blocks/Navigation.vue'
import BuilderBreadcrumb from './blocks/Breadcrumb.vue'
import BuilderGallery from './blocks/Gallery.vue'
import BuilderVideo from './blocks/Video.vue'

// ノード 1 つを、種類(type)に対応する部品で描く。子は各部品がこの部品で再帰的に描く。
// 種類 → 部品の対応表に足すだけで、ブロックの種類を増やせる(biscuit の BlockRegistry にも同じ種類を足す)。
// 対応表にない種類(chococo が古い場合など)は描かない
const props = defineProps<{
  node: BuilderNode
}>()

const blocks: Record<string, Component> = {
  'section': BuilderSection,
  'container': BuilderContainer,
  'row': BuilderRow,
  'column': BuilderColumn,
  'heading': BuilderHeading,
  'text': BuilderText,
  'image': BuilderImage,
  'button': BuilderButton,
  'spacer': BuilderSpacer,
  'divider': BuilderDivider,
  'article-list': BuilderArticleList,
  'navigation': BuilderNavigation,
  'breadcrumb': BuilderBreadcrumb,
  'gallery': BuilderGallery,
  'video': BuilderVideo,
}

const block = computed(() => blocks[props.node.type])
</script>

<template>
  <component :is="block" v-if="block" :node="node" :class="builderClass(node)" />
</template>
