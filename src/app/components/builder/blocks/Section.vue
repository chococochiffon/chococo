<script setup lang="ts">
import type { BuilderNode } from '~/types/builder'

// セクション: ページの最上位の区切り。画面幅いっぱいに広がり、背景画像を敷ける。
// 自由配置(v2)の内容では、中身を面(.builder-free)に入れて座標で置く
const props = defineProps<{
  node: BuilderNode
}>()

const isFree = inject(builderVersionKey, 1) >= BUILDER_FREE_LAYOUT_VERSION

const backgroundImage = computed(() => builderImageUrl(props.node.props.backgroundImage))
</script>

<template>
  <section
    class="builder-section"
    :style="backgroundImage ? { backgroundImage: `url(${backgroundImage})` } : undefined"
  >
    <div v-if="isFree" class="builder-free">
      <BuilderNodeView v-for="child in node.children ?? []" :key="child.id" :node="child" />
    </div>
    <template v-else>
      <BuilderNodeView v-for="child in node.children ?? []" :key="child.id" :node="child" />
    </template>
  </section>
</template>

<style scoped>
.builder-section {
  background-position: center center;
  background-size: cover;
}
</style>
