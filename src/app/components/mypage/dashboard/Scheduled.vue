<script setup lang="ts">
import type { MyDashboard } from '~/types/api'

// ダッシュボードの「公開予定」(自分の予約公開の記事を、今日公開・今週公開予定に分けて出す)
defineProps<{
  scheduled: MyDashboard['scheduled']
}>()

const groups = [
  { key: 'today', label: '今日公開' },
  { key: 'this_week', label: '今週公開予定(7日以内)' },
] as const

// 公開予定の時刻(今日は時刻だけ、今週は月日と時刻)
function formatScheduled(iso: string, withDate: boolean): string {
  return new Date(iso).toLocaleString('ja-JP', {
    timeZone: 'Asia/Tokyo',
    ...(withDate ? { month: '2-digit', day: '2-digit' } : {}),
    hour: '2-digit',
    minute: '2-digit',
  })
}
</script>

<template>
  <div class="card h-100">
    <div class="card-header bg-transparent fw-semibold">公開予定</div>
    <div class="card-body">
      <div v-for="(group, index) in groups" :key="group.key" :class="{ 'mb-3': index === 0 }">
        <div class="small text-body-secondary mb-1">{{ group.label }}</div>
        <div v-for="article in scheduled[group.key]" :key="article.id" class="d-flex align-items-baseline gap-2 py-1">
          <span class="small text-nowrap text-body-secondary">{{ formatScheduled(article.publish_at, group.key === 'this_week') }}</span>
          <NuxtLink :to="myContentEditPath({ type: 'article', id: article.id })" class="text-truncate">{{ article.title }}</NuxtLink>
        </div>
        <div v-if="scheduled[group.key].length === 0" class="small text-body-secondary">予定はありません。</div>
      </div>
    </div>
  </div>
</template>
