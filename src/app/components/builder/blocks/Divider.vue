<script setup lang="ts">
import type { BuilderNode } from '~/types/builder'

// 区切り線(Bootstrap の hr)。線の色・太さ・種類はスタイルで変えられる(線の色を指定すると不透明にする。utils/builderStyles.ts)
defineProps<{
  node: BuilderNode
}>()
</script>

<template>
  <hr>
</template>
