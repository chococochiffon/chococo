<script setup lang="ts">
import type { SocialService } from '~/types/api'

// SNS リンクをサイト設定の並び順でアイコンで並べる(サービス種別ごとの Bootstrap Icons)
const { data: siteSetting } = await useSiteSetting()

const socialIcons: Record<SocialService, string> = {
  x: 'bi-twitter-x',
  youtube: 'bi-youtube',
  github: 'bi-github',
  instagram: 'bi-instagram',
  facebook: 'bi-facebook',
  tiktok: 'bi-tiktok',
  twitch: 'bi-twitch',
  discord: 'bi-discord',
  threads: 'bi-threads',
  amazon: 'bi-amazon',
  other: 'bi-link-45deg',
}
const socialLinks = computed(() => siteSetting.value?.social_links ?? [])
</script>

<template>
  <ul v-if="socialLinks.length" class="nav list-unstyled d-flex gap-3 mb-0">
    <li v-for="link in socialLinks" :key="link.id">
      <a class="text-body-secondary fs-4" target="_blank" rel="noopener" :href="link.url" :aria-label="link.name" :title="link.name">
        <i class="bi" :class="socialIcons[link.service] ?? socialIcons.other" />
      </a>
    </li>
  </ul>
</template>
