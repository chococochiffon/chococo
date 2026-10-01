<script setup lang="ts">
// ページビルダーのリンク。サイト内のパス(/ 始まり)は NuxtLink、それ以外(外部・mailto・tel・#)は <a> にする。
// 出してよくないリンク先(builderHref() が null)ならリンクにせず中身だけを出す
const props = defineProps<{
  href: unknown
  target?: string
}>()

const url = computed(() => builderHref(props.href))
const isInternal = computed(() => url.value?.startsWith('/') ?? false)
const rel = computed(() => (props.target === '_blank' ? 'noopener noreferrer' : undefined))
</script>

<template>
  <NuxtLink v-if="url && isInternal" :to="url" :target="target" :rel="rel"><slot /></NuxtLink>
  <a v-else-if="url" :href="url" :target="target" :rel="rel"><slot /></a>
  <span v-else><slot /></span>
</template>
