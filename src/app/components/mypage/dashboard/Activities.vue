<script setup lang="ts">
import type { MyDashboard } from '~/types/api'

// ダッシュボードの「最近の操作」(自分の操作。ログインまわりは biscuit が除いて返す)
defineProps<{
  activities: MyDashboard['recent_activities']
}>()
</script>

<template>
  <div class="card mb-4">
    <div class="card-header bg-transparent fw-semibold">最近の操作</div>
    <ul class="list-group list-group-flush">
      <li v-for="(activity, index) in activities" :key="index" class="list-group-item d-flex flex-wrap align-items-center gap-2">
        <span class="small text-body-secondary text-nowrap">{{ formatDateTime(activity.created_at) }}</span>
        <span class="badge text-bg-light border">{{ activity.action_label }}</span>
        <span>
          <span v-if="activity.subject_type_label" class="text-body-secondary">{{ activity.subject_type_label }}</span>
          {{ activity.subject_label }}
        </span>
      </li>
      <li v-if="activities.length === 0" class="list-group-item small text-body-secondary">操作の記録はまだありません。</li>
    </ul>
  </div>
</template>
