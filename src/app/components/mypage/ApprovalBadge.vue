<script setup lang="ts">
import type { ArticleApproval } from '~/types/api'

// マイページの記事の公開ステータスのバッジ
const props = defineProps<{
  approval: ArticleApproval
}>()

const badges: Record<ArticleApproval, { label: string, color: string }> = {
  draft: { label: '下書き', color: 'secondary' },
  pending: { label: '承認待ち', color: 'warning' },
  published: { label: '公開中', color: 'success' },
}

const badge = computed(() => badges[props.approval])
</script>

<template>
  <span class="badge" :class="`text-bg-${badge.color}`">{{ badge.label }}</span>
</template>
