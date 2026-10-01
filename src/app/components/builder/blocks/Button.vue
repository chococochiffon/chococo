<script setup lang="ts">
import type { BuilderNode } from '~/types/builder'

// ボタン(Bootstrap の .btn)。文字揃え・余白はこの枠に、色・角丸・文字の大きさはボタンに効く
const props = defineProps<{
  node: BuilderNode
}>()

const VARIANTS = ['primary', 'secondary', 'outline-primary', 'outline-secondary', 'link'] as const

const text = computed(() => builderString(props.node, 'text'))
const target = computed(() => builderEnum(props.node, 'target', ['_self', '_blank'] as const, '_self'))
const variant = computed(() => builderEnum(props.node, 'variant', VARIANTS, 'primary'))
</script>

<template>
  <div class="builder-button">
    <BuilderLink :href="node.props.href" :target="target === '_blank' ? '_blank' : undefined" class="btn" :class="`btn-${variant}`">
      {{ text }}
    </BuilderLink>
  </div>
</template>
