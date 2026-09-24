<script setup lang="ts">
import type { NuxtError } from '#app'

const props = defineProps<{
  error: NuxtError
}>()

const isNotFound = computed(() => props.error.statusCode === 404)

useSeoMeta({
  title: () => (isNotFound.value ? 'ページが見つかりません' : 'エラーが発生しました'),
})
</script>

<template>
  <NuxtLayout>
    <div class="container">
      <div class="text-center m-4 p-4">
        <p class="display-4 fw-bold font-monospace">{{ error.statusCode }}</p>
        <p v-if="isNotFound">お探しのページは見つかりませんでした。</p>
        <p v-else>ページを表示できませんでした。時間をおいてもう一度お試しください。</p>
        <button type="button" class="btn btn-outline-secondary mt-3" @click="clearError({ redirect: '/' })">
          トップへもどる
        </button>
      </div>
    </div>
  </NuxtLayout>
</template>
