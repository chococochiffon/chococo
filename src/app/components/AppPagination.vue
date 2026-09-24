<script setup lang="ts">
// ページ送り(?page=N のリンク)。現在のページの前後数ページと先頭・末尾を表示する
const props = defineProps<{
  currentPage: number
  lastPage: number
}>()

const route = useRoute()

// 表示するページ番号(間を省略する箇所は null)
const pages = computed<(number | null)[]>(() => {
  const around = 2
  const numbers = new Set([1, props.lastPage])
  for (let page = props.currentPage - around; page <= props.currentPage + around; page++) {
    if (page >= 1 && page <= props.lastPage) {
      numbers.add(page)
    }
  }

  const sorted = [...numbers].sort((a, b) => a - b)

  return sorted.flatMap((page, index) => (index > 0 && page - sorted[index - 1]! > 1 ? [null, page] : [page]))
})

const pageLink = (page: number) => ({ path: route.path, query: { ...route.query, page: page === 1 ? undefined : page } })
</script>

<template>
  <nav v-if="lastPage > 1" aria-label="ページ送り">
    <ul class="pagination justify-content-center">
      <li class="page-item" :class="{ disabled: currentPage <= 1 }">
        <NuxtLink class="page-link" :to="pageLink(Math.max(currentPage - 1, 1))" aria-label="前のページ">&laquo;</NuxtLink>
      </li>
      <li v-for="(page, index) in pages" :key="index" class="page-item" :class="{ active: page === currentPage, disabled: page === null }">
        <span v-if="page === null" class="page-link">…</span>
        <NuxtLink v-else class="page-link" :to="pageLink(page)" :aria-current="page === currentPage ? 'page' : undefined">{{ page }}</NuxtLink>
      </li>
      <li class="page-item" :class="{ disabled: currentPage >= lastPage }">
        <NuxtLink class="page-link" :to="pageLink(Math.min(currentPage + 1, lastPage))" aria-label="次のページ">&raquo;</NuxtLink>
      </li>
    </ul>
  </nav>
</template>
