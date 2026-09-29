<script setup lang="ts">
// マイページのログイン。ログインできるのは biscuit の管理画面で登録したユーザーだけ
definePageMeta({ headerNavigation: false })

const route = useRoute()
const { me, fetchMe, login } = useMe()

// ログイン後に戻るページ(サイト内のパスだけ受け付ける)
const redirectTo = computed(() => {
  const redirect = typeof route.query.redirect === 'string' ? route.query.redirect : ''

  return redirect.startsWith('/') && !redirect.startsWith('//') ? redirect : '/mypage'
})

if (!me.value) {
  await fetchMe()
}
if (me.value) {
  await navigateTo(redirectTo.value, { replace: true })
}

const email = ref('')
const password = ref('')
const error = ref('')
const submitting = ref(false)

async function submit() {
  submitting.value = true
  error.value = ''

  try {
    await login(email.value, password.value)
    await navigateTo(redirectTo.value)
  }
  catch (e) {
    error.value = (e as { statusCode?: number }).statusCode === 429
      ? 'ログインの試行回数が多すぎます。しばらくしてからもう一度お試しください。'
      : errorMessage(e, 'ログインに失敗しました。')
  }
  finally {
    submitting.value = false
  }
}

useSeoMeta({ title: 'ログイン', robots: 'noindex' })
</script>

<template>
  <LayoutSidebarFrame page-type="other">
    <div class="container">
      <div class="row py-5 justify-content-center">
        <div class="col-md-6 col-lg-5">
          <SectionHeading title="Login" subtitle="ログイン" />
          <form class="card card-body shadow-sm" novalidate @submit.prevent="submit">
            <div v-if="error" class="alert alert-danger small" role="alert">{{ error }}</div>
            <div class="mb-3">
              <label for="login-email" class="form-label">メールアドレス</label>
              <input id="login-email" v-model="email" type="email" class="form-control" autocomplete="username" required>
            </div>
            <div class="mb-4">
              <label for="login-password" class="form-label">パスワード</label>
              <input id="login-password" v-model="password" type="password" class="form-control" autocomplete="current-password" required>
            </div>
            <button type="submit" class="btn btn-primary w-100" :disabled="submitting">ログイン</button>
            <div class="text-center small mt-3">
              <NuxtLink to="/forgot-password">パスワードを忘れた方</NuxtLink>
            </div>
          </form>
        </div>
      </div>
    </div>
  </LayoutSidebarFrame>
</template>
