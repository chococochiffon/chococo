<script setup lang="ts">
import type { BuilderNode } from '~/types/builder'

// 見出し(h1〜h6)
const props = defineProps<{
  node: BuilderNode
}>()

const tag = computed(() => `h${builderInt(props.node, 'level', 1, 6, 2)}`)
const text = computed(() => builderString(props.node, 'text'))
</script>

<template>
  <component :is="tag">{{ text }}</component>
</template>
