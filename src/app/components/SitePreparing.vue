<script setup lang="ts">
// biscuit のインストール中(API が 503)に出す「準備中」の画面。レイアウト(ヘッダー・フッター)も API から読むため使わない
useSeoMeta({
  title: 'サイトは準備中です',
})
</script>

<template>
  <main class="site-preparing d-flex align-items-center justify-content-center text-center px-3">
    <div>
      <i class="bi bi-hourglass-split display-4 text-secondary" aria-hidden="true" />
      <h1 class="h4 mt-3">サイトは準備中です</h1>
      <p class="text-secondary mb-0">公開まで、しばらくお待ちください。</p>
    </div>
  </main>
</template>

<style scoped>
.site-preparing {
  min-height: 100svh;
}
</style>
