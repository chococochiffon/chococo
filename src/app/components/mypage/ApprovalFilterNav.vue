<script setup lang="ts">
import type { ArticleApproval } from '~/types/api'

// 一覧の公開ステータスの絞り込み(useApprovalFilter() の filters と選択中の approval を受け取る)
defineProps<{
  filters: { value: ArticleApproval | undefined, label: string }[]
  approval: ArticleApproval | undefined
}>()
</script>

<template>
  <div class="card card-body mb-3 py-2">
    <ul class="nav nav-pills small" aria-label="ステータスで絞り込み">
      <li v-for="filter in filters" :key="filter.label" class="nav-item">
        <NuxtLink class="nav-link py-1" :class="{ active: filter.value === approval }" :to="{ query: { approval: filter.value } }">{{ filter.label }}</NuxtLink>
      </li>
    </ul>
  </div>
</template>
