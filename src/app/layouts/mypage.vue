<script setup lang="ts">
// マイページ(ログイン中の画面)のレイアウト。biscuit のシステム管理画面と同じく、左にサイドメニュー、上にトップバーを置く。
// 公開側のヘッダー・フッターは出さず、サイトへ戻るリンクをサイドメニューに置く
const route = useRoute()
const { me, logout } = useMe()
const { data: siteSetting } = await useSiteSetting()

// スマートフォンでサイドメニューを開いているか(ページを移動したら閉じる)
const sidebarOpen = ref(false)
watch(() => route.fullPath, () => {
  sidebarOpen.value = false
})

const menu = [
  { to: '/mypage', icon: 'bi-person-circle', label: 'プロフィール', exact: true },
  { to: '/mypage/articles', icon: 'bi-file-earmark-text', label: '記事の管理', exact: false },
  { to: '/mypage/password', icon: 'bi-key', label: 'パスワードの変更', exact: true },
]

const isActive = (item: typeof menu[number]) => (item.exact ? route.path === item.to : route.path.startsWith(item.to))

async function onLogout() {
  await logout()
  await navigateTo('/')
}

useHead({
  link: [{ rel: 'stylesheet', href: 'https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700;800&display=swap' }],
})
</script>

<template>
  <div class="mypage-shell d-flex">
    <aside class="mypage-sidebar flex-shrink-0" :class="{ 'is-open': sidebarOpen }">
      <NuxtLink to="/mypage" class="mypage-sidebar-brand">マイページ</NuxtLink>

      <hr class="mypage-sidebar-divider">

      <ul class="nav flex-column mypage-sidebar-nav">
        <li v-for="item in menu" :key="item.to" class="nav-item">
          <NuxtLink :to="item.to" class="nav-link" :class="{ active: isActive(item) }" :aria-current="isActive(item) ? 'page' : undefined">
            <i class="bi" :class="item.icon" />{{ item.label }}
          </NuxtLink>
        </li>
      </ul>

      <hr class="mypage-sidebar-divider">

      <div class="mypage-sidebar-heading">サイト</div>
      <ul class="nav flex-column mypage-sidebar-nav">
        <li class="nav-item">
          <NuxtLink to="/" class="nav-link">
            <i class="bi bi-box-arrow-up-left" />{{ siteSetting?.site_title || 'サイト' }}へ戻る
          </NuxtLink>
        </li>
      </ul>
    </aside>
    <div v-if="sidebarOpen" class="mypage-sidebar-backdrop d-md-none" @click="sidebarOpen = false" />

    <div class="d-flex flex-column flex-grow-1 min-vh-100" style="min-width: 0;">
      <nav class="mypage-topbar navbar navbar-expand navbar-light bg-white">
        <div class="container-fluid">
          <button type="button" class="btn btn-link text-secondary p-0 d-md-none" aria-label="メニューを開く" :aria-expanded="sidebarOpen" @click="sidebarOpen = !sidebarOpen">
            <i class="bi bi-list fs-4" />
          </button>
          <div class="d-flex align-items-center justify-content-end gap-3 ms-auto">
            <div v-if="me" class="small">{{ me.name }}</div>
            <button type="button" class="btn btn-link nav-link text-secondary p-0 small" @click="onLogout">ログアウト</button>
          </div>
        </div>
      </nav>

      <main class="flex-grow-1 p-3 p-md-4">
        <slot />
      </main>
    </div>
  </div>
</template>
