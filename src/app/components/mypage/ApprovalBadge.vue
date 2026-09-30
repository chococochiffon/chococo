<script setup lang="ts">
import type { ContentStatus } from '~/types/api'

// マイページの記事の公開ステータス(ダッシュボードでは公開期間を合わせた状態)のバッジ
const props = defineProps<{
  approval: ContentStatus
}>()

const badges: Record<ContentStatus, { label: string, color: string }> = {
  draft: { label: '下書き', color: 'secondary' },
  pending: { label: '承認待ち', color: 'warning' },
  published: { label: '公開中', color: 'success' },
  scheduled: { label: '予約公開', color: 'info' },
  ended: { label: '公開終了', color: 'secondary' },
  unscheduled: { label: '非公開', color: 'secondary' },
}

const badge = computed(() => badges[props.approval])
</script>

<template>
  <span class="badge" :class="`text-bg-${badge.color}`">{{ badge.label }}</span>
</template>
