<script setup lang="ts">
// ダッシュボードの「クイック操作」(よく使う画面へのショートカット。投稿者ページは公開しているときだけ)
defineProps<{
  profilePath: string | null
}>()

const actions = [
  { to: '/mypage/articles/new', icon: 'bi-pencil-square', label: '記事を書く' },
  { to: '/mypage/gallery/new', icon: 'bi-image', label: 'ギャラリーに投稿' },
  { to: '/mypage/profile', icon: 'bi-person-gear', label: 'プロフィールを編集' },
] as const
</script>

<template>
  <div class="card h-100">
    <div class="card-header bg-transparent fw-semibold">クイック操作</div>
    <div class="list-group list-group-flush">
      <NuxtLink v-for="action in actions" :key="action.to" :to="action.to" class="list-group-item list-group-item-action d-flex align-items-center gap-2">
        <i class="bi text-primary" :class="action.icon" />{{ action.label }}
      </NuxtLink>
      <NuxtLink v-if="profilePath" :to="profilePath" class="list-group-item list-group-item-action d-flex align-items-center gap-2">
        <i class="bi bi-box-arrow-up-right text-primary" />投稿者ページを見る
      </NuxtLink>
    </div>
  </div>
</template>
