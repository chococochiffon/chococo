<script setup lang="ts">
import type { SocialService } from '~/types/api'

// フッターには、共通部品(その他)の呼び出しコンテンツのうちナビに出さないもの(記事のリンクなど)を並べる
const { data: siteSetting } = await useSiteSetting()
const { data: commonCallContents } = await useCommonCallContents()

const siteTitle = computed(() => siteSetting.value?.site_title || 'Chococo Chiffon')
const year = new Date().getFullYear()

const footerContents = computed(() =>
  (commonCallContents.value ?? [])
    .map(callContent => ({ callContent, content: callContentItems(callContent) }))
    .filter(({ content }) => content.kind !== 'single_pages' && content.items.length > 0),
)

// SNS リンクはサイト設定の並び順でアイコンを並べる(サービス種別ごとの Bootstrap Icons)
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
  <footer>
    <div class="container">
      <div v-if="footerContents.length" class="row py-4 mt-4 border-top">
        <div v-for="({ callContent, content }, index) in footerContents" :key="index" class="col-md-4 mb-3">
          <h5 v-if="callContent.title" class="fs-6 fw-bold">{{ callContent.title }}</h5>
          <ul class="list-unstyled small mb-0">
            <template v-if="content.kind === 'articles'">
              <li v-for="article in content.items" :key="article.id" class="mb-1">
                <NuxtLink :to="article.path" class="link-secondary">{{ article.title }}</NuxtLink>
              </li>
            </template>
            <template v-else-if="content.kind === 'user_details'">
              <li v-for="userDetail in content.items" :key="userDetail.id" class="mb-1 text-body-secondary">
                {{ userDisplayName(userDetail) }}
              </li>
            </template>
          </ul>
        </div>
      </div>
      <div class="d-flex flex-wrap justify-content-between align-items-center py-3 my-4 border-top">
        <div class="col-md-4 d-flex align-items-center">
          <span class="mb-3 mb-md-0 text-body-secondary">&copy; {{ year }} {{ siteTitle }}.</span>
        </div>
        <ul v-if="socialLinks.length" class="nav col-md-4 justify-content-end list-unstyled d-flex">
          <li v-for="link in socialLinks" :key="link.id" class="ms-3">
            <a class="text-body-secondary fs-4" target="_blank" rel="noopener" :href="link.url" :aria-label="link.name" :title="link.name">
              <i class="bi" :class="socialIcons[link.service] ?? socialIcons.other" />
            </a>
          </li>
        </ul>
      </div>
    </div>
  </footer>
</template>
