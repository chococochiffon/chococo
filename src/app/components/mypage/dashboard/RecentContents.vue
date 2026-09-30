<script setup lang="ts">
import type { MyDashboard } from '~/types/api'

// ダッシュボードの「最近編集したもの」(自分の記事・画像。編集画面へのボタン付き)
defineProps<{
  contents: MyDashboard['recent_contents']
}>()
</script>

<template>
  <div class="card h-100">
    <div class="card-header bg-transparent fw-semibold">最近編集したもの</div>
    <div class="table-responsive">
      <table class="table table-hover align-middle mb-0">
        <thead>
          <tr class="small text-nowrap">
            <th>タイトル</th>
            <th>状態</th>
            <th>更新日時</th>
            <th />
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in contents" :key="`${item.type}-${item.id}`">
            <td>
              <div class="small text-body-secondary">{{ myContentTypeLabels[item.type] }}</div>
              {{ item.title }}
            </td>
            <td><MypageApprovalBadge :approval="item.status" /></td>
            <td class="small text-nowrap">{{ formatDateTime(item.updated_at) }}</td>
            <td class="text-end">
              <NuxtLink :to="myContentEditPath(item)" class="btn btn-sm btn-outline-secondary text-nowrap">編集</NuxtLink>
            </td>
          </tr>
          <tr v-if="contents.length === 0">
            <td colspan="4" class="text-center text-body-secondary py-4">まだ記事・画像がありません。</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>
