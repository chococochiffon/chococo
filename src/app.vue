<script setup lang="ts">
useHead({
  title: 'Chococo Games',
  ogTitle: 'Chococo Games',
  description: 'This is my amazing site, let me tell you all about it.',
  ogDescription: 'This is my amazing site, let me tell you all about it.',
  ogImage: 'https://example.com/image.png',
  twitterCard: 'summary_large_image',
  meta: [
    { name: 'description', content: 'Chococo Games' }
  ],
  link: [
    { rel: 'preconnect', href: 'https://fonts.googleapis.com' }
  ]
})
</script>
<template>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>