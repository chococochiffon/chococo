<script setup lang="ts">
import type { BuilderNode } from '~/types/builder'

// 動画: biscuit が動画の URL(YouTube・Vimeo)の ID から組み立てた埋め込み用の URL(data.embed_url)を、縦横比を保った iframe で出す。
// biscuit が組み立てた形の URL だけを iframe にし(builderVideoEmbedUrl())、それ以外・未入力なら何も出さない
const props = defineProps<{
  node: BuilderNode
}>()

const embedUrl = computed(() => builderVideoEmbedUrl(props.node.data?.embed_url))
const aspect = computed(() => builderEnum(props.node, 'aspect', ['16x9', '4x3', '1x1', '21x9'] as const, '16x9'))
const title = computed(() => builderString(props.node, 'title', '動画') || '動画')
</script>

<template>
  <div class="builder-video">
    <div v-if="embedUrl" class="ratio" :class="`ratio-${aspect}`">
      <iframe
        :src="embedUrl"
        :title="title"
        loading="lazy"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        referrerpolicy="strict-origin-when-cross-origin"
        allowfullscreen
      />
    </div>
  </div>
</template>
