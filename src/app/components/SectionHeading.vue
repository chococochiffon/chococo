<script setup lang="ts">
// 各セクションの見出し(下線付きのタイトルと小見出し)。どちらも未設定なら何も表示しない
defineProps<{
  title?: string | null
  subtitle?: string | null
}>()
</script>

<template>
  <div v-if="title || subtitle" class="col-lg-12">
    <div class="text-center mx-1 px-1 mb-4">
      <h2 v-if="title" class="fw-bold font-monospace">
        <span class="underline">{{ title }}</span>
      </h2>
      <p v-if="subtitle">{{ subtitle }}</p>
    </div>
  </div>
</template>
