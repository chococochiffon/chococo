<script setup lang="ts">
import type { BuilderNode } from '~/types/builder'

// セクション: ページの最上位の区切り。画面幅いっぱいに広がり、背景画像を敷ける
const props = defineProps<{
  node: BuilderNode
}>()

const backgroundImage = computed(() => builderImageUrl(props.node.props.backgroundImage))
</script>

<template>
  <section
    class="builder-section"
    :style="backgroundImage ? { backgroundImage: `url(${backgroundImage})` } : undefined"
  >
    <BuilderNodeView v-for="child in node.children ?? []" :key="child.id" :node="child" />
  </section>
</template>

<style scoped>
.builder-section {
  background-position: center center;
  background-size: cover;
}
</style>
