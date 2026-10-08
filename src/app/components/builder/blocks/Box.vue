<script setup lang="ts">
import type { BuilderNode } from '~/types/builder'

// ボックス(自由配置の v2 だけ): 背景・角丸・枠線を持つまとまり。中も面(.builder-free)で、ブロックを座標で置く(ボックスの中にボックスも置ける)
const props = defineProps<{
  node: BuilderNode
}>()

const backgroundImage = computed(() => builderImageUrl(props.node.props.backgroundImage))
</script>

<template>
  <div
    class="builder-box builder-free"
    :style="backgroundImage ? { backgroundImage: `url(${backgroundImage})` } : undefined"
  >
    <BuilderNodeView v-for="child in node.children ?? []" :key="child.id" :node="child" />
  </div>
</template>

<style scoped>
.builder-box {
  background-position: center center;
  background-size: cover;
}
</style>
