<script setup lang="ts">
import type { BuilderNode } from '~/types/builder'

// スペーサー: 指定した高さ(px)の空き
const props = defineProps<{
  node: BuilderNode
}>()

const height = computed(() => builderInt(props.node, 'height', 0, 400, 32))
</script>

<template>
  <div :style="{ height: `${height}px` }" aria-hidden="true" />
</template>
