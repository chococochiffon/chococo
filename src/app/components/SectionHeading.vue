<script setup lang="ts">
// 各セクションの見出し(下線付きのタイトルと小見出し)
defineProps<{
  title: string
  subtitle?: string
}>()
</script>

<template>
  <div class="col-lg-12">
    <div class="text-center mx-1 px-1 mb-4">
      <h2 class="fw-bold font-monospace">
        <span class="underline">{{ title }}</span>
      </h2>
      <p v-if="subtitle">{{ subtitle }}</p>
    </div>
  </div>
</template>
