<script setup lang="ts">
import type { BuilderNode } from '~/types/builder'

// スライダー: 中に置いたスライド(画像・代替テキスト・リンク先)を、トップと同じスライダー(TopSlider)で縦横比を保って切り替える。
// 画像のないスライドは飛ばし、表示する画像がなければ何も出さない
const props = defineProps<{
  node: BuilderNode
}>()

const slides = computed(() => (props.node.children ?? []).flatMap((slide) => {
  const imageUrl = builderImageUrl(slide.props.src)

  return imageUrl ? [{ id: slide.id, image_url: imageUrl, url: builderHref(slide.props.href), alt: builderString(slide, 'alt') }] : []
}))
const aspect = computed(() => builderEnum(props.node, 'aspect', ['16x9', '21x9', '4x3', '1x1'] as const, '16x9'))
const interval = computed(() => builderInt(props.node, 'interval', 2, 30, 5) * 1000)
</script>

<template>
  <div class="builder-slider">
    <div v-if="slides.length" class="ratio" :class="`ratio-${aspect}`">
      <TopSlider
        :slides="slides"
        label="スライダー"
        :interval="interval"
        :autoplay="builderBool(node, 'autoplay', true)"
        :controls="builderBool(node, 'showControls', true)"
        :indicators="builderBool(node, 'showIndicators', true)"
      />
    </div>
  </div>
</template>

<style scoped>
/* 角丸のスタイルを画像にも効かせる */
.builder-slider {
  overflow: hidden;
}
</style>
