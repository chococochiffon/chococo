<script setup lang="ts">
// マイページのダッシュボード(ログイン後の既定の画面)。表示する項目はこれから決めるため、今は見出しだけ
definePageMeta({ middleware: 'auth', layout: 'mypage' })

useSeoMeta({ title: 'ダッシュボード', robots: 'noindex' })
</script>

<template>
  <div class="mypage-page">
    <div class="mb-4 d-flex align-items-center justify-content-between">
      <h1 class="h5 mb-0">ダッシュボード</h1>
    </div>
  </div>
</template>
