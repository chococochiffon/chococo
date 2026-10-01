<script setup lang="ts">
import type { BuilderNode } from '~/types/builder'

// 画像。リンク先があればリンクにする。幅・角丸のスタイルは画像に、文字揃え・余白はこの枠に効く
const props = defineProps<{
  node: BuilderNode
}>()

const src = computed(() => builderImageUrl(props.node.props.src))
const alt = computed(() => builderString(props.node, 'alt'))
</script>

<template>
  <div class="builder-image">
    <BuilderLink v-if="src && node.props.href" :href="node.props.href">
      <img :src="src" :alt="alt" class="img-fluid" loading="lazy">
    </BuilderLink>
    <img v-else-if="src" :src="src" :alt="alt" class="img-fluid" loading="lazy">
  </div>
</template>
