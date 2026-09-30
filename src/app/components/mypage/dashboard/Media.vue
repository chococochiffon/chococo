<script setup lang="ts">
import type { MyDashboard } from '~/types/api'

// ダッシュボードの「画像」(自分がアップロードした画像の件数・容量)
defineProps<{
  media: MyDashboard['media']
}>()

const labels: Record<MyDashboard['media']['groups'][number]['key'], string> = {
  thumbnail: '記事のサムネイル',
  gallery: 'ギャラリー',
  icon: 'アイコン',
}
</script>

<template>
  <div class="card h-100">
    <div class="card-header bg-transparent fw-semibold">画像</div>
    <div class="card-body">
      <div class="d-flex flex-wrap gap-4 mb-3">
        <div>
          <div class="small text-body-secondary">画像</div>
          <div class="fs-4 fw-semibold">{{ media.count.toLocaleString() }}</div>
        </div>
        <div>
          <div class="small text-body-secondary">使用容量</div>
          <div class="fs-4 fw-semibold">{{ formatFileSize(media.bytes) }}</div>
        </div>
      </div>
      <table class="table table-sm small mb-0">
        <tbody>
          <tr v-for="group in media.groups" :key="group.key">
            <td class="text-body-secondary">{{ labels[group.key] }}</td>
            <td class="text-end">{{ group.count.toLocaleString() }}件</td>
            <td class="text-end text-nowrap">{{ formatFileSize(group.bytes) }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>
