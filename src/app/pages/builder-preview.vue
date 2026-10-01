<script setup lang="ts">
import type { ResolveResponse } from '~/types/api'

// ページビルダーの下書きのプレビュー。biscuit の管理画面の「プレビュー」が、期限付きの署名(id・expires・signature)を付けて開く。
// 署名付きのプレビュー API(GET /api/builder-previews/{id})の内容を、公開中のページと同じ部品(PageResolved)で表示する。
// 検索エンジンに載せず、PV も記録しない
const route = useRoute()

const query = computed(() => ({
  id: String(route.query.id ?? ''),
  expires: String(route.query.expires ?? ''),
  signature: String(route.query.signature ?? ''),
}))
const isValidQuery = computed(() => /^\d+$/.test(query.value.id) && query.value.expires !== '' && query.value.signature !== '')

const { data: page, error } = await useApi<ResolveResponse>(() => `/builder-previews/${query.value.id}`, {
  key: `builder-preview:${query.value.id}:${query.value.signature}`,
  query: computed(() => ({ expires: query.value.expires, signature: query.value.signature })),
  immediate: isValidQuery.value,
})

useSeoMeta({
  robots: 'noindex, nofollow',
})
</script>

<template>
  <div>
    <div class="alert alert-warning rounded-0 mb-0 text-center small" role="status">
      ページビルダーのプレビュー(下書き)です。公開中のページにはまだ反映されていません。
    </div>
    <PageResolved v-if="page && !error" :page="page" />
    <div v-else class="container">
      <div class="text-center m-4 p-4">
        <p>プレビューを表示できませんでした。</p>
        <p class="small text-secondary">
          プレビューの URL は 30 分で無効になります。管理画面のページビルダーから、もう一度プレビューを開いてください。
        </p>
      </div>
    </div>
  </div>
</template>
