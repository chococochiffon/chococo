<script setup lang="ts" generic="TKey extends string">
// ダッシュボードの件数のカード。合計を一覧へのリンクにし、内訳(items の key の件数を counts から取る)を並べる
defineProps<{
  label: string
  to: string
  counts: Record<TKey | 'total', number>
  items: readonly { key: TKey, label: string }[]
}>()
</script>

<template>
  <div class="card h-100">
    <div class="card-body d-flex flex-wrap align-items-center gap-4">
      <NuxtLink :to="to" class="text-decoration-none text-reset">
        <div class="small text-body-secondary">{{ label }}</div>
        <div class="fs-3 fw-semibold">{{ counts.total.toLocaleString() }}</div>
      </NuxtLink>
      <dl class="d-flex flex-wrap gap-4 mb-0">
        <div v-for="item in items" :key="item.key">
          <dt class="small text-body-secondary fw-normal">{{ item.label }}</dt>
          <dd class="fs-5 mb-0">{{ counts[item.key].toLocaleString() }}</dd>
        </div>
      </dl>
    </div>
  </div>
</template>
