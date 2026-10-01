<script setup lang="ts">
import type { ResolveResponse } from '~/types/api'

// すべての URL をこのページで受け、biscuit のパス解決 API でトップ・固定ページ・記事を出し分ける(表示は PageResolved)。
// パスが変わるたびにページを作り直し、取得と 404 の判定をやり直す
definePageMeta({
  key: route => route.path,
})

const route = useRoute()

const { data: page, error } = await useApi<ResolveResponse>('/resolve', {
  key: `resolve:${route.path}`,
  query: { path: route.path },
})

if (error.value || !page.value) {
  const statusCode = error.value?.statusCode ?? 404
  throw createError({
    statusCode,
    statusMessage: statusCode === 404 ? 'Page Not Found' : 'Server Error',
    fatal: true,
  })
}

// 表示できたページだけを 1 PV として記録する(404 などのエラーでは送らない。ブラウザで表示し終えたときに 1 回)
const { $recordPageView } = useNuxtApp()

onMounted(() => {
  $recordPageView(route.path)
})
</script>

<template>
  <PageResolved v-if="page" :page="page" />
</template>
