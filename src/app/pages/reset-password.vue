<script setup lang="ts">
// パスワードの再設定: メールのリンク(?token=…&email=…)から開き、新しいパスワードを設定する。
// 設定すると、ほかの端末を含めて発行済みのログインはすべて無効になるため、あらためてログインしてもらう
definePageMeta({ headerNavigation: false })

const route = useRoute()
const token = computed(() => (typeof route.query.token === 'string' ? route.query.token : ''))
const email = computed(() => (typeof route.query.email === 'string' ? route.query.email : ''))

const form = reactive({ password: '', password_confirmation: '' })
const completed = ref(false)
// リンクが無効・期限切れのとき(email・token のエラー)は、全体のエラーとして出す
const { errors, submitting, submit: send } = useFormSubmit({ generalErrorFields: ['email', 'token'] })

async function submit() {
  await send(async () => {
    await $fetch('/api/auth/reset-password', { method: 'POST', body: { token: token.value, email: email.value, ...form } })
    completed.value = true
    useMe().me.value = null
  })
}

useSeoMeta({ title: 'パスワードの再設定', robots: 'noindex' })
</script>

<template>
  <LayoutSidebarFrame page-type="other">
    <div class="container">
      <div class="row py-5 justify-content-center">
        <div class="col-md-6 col-lg-5 mypage-accent">
          <SectionHeading title="Reset Password" subtitle="パスワードの再設定" />

          <div v-if="completed" class="card card-body shadow-sm text-center">
            <p class="mb-3">パスワードを再設定しました。新しいパスワードでログインしてください。</p>
            <NuxtLink to="/login" class="btn btn-primary">ログインへ</NuxtLink>
          </div>

          <div v-else-if="!token || !email" class="card card-body shadow-sm text-center">
            <p class="mb-3">リンクが正しくありません。メールのリンクをもう一度開くか、再設定のメールを送り直してください。</p>
            <NuxtLink to="/forgot-password" class="btn btn-outline-primary">再設定のメールを送る</NuxtLink>
          </div>

          <form v-else class="card card-body shadow-sm" novalidate @submit.prevent="submit">
            <div v-if="errors._" class="alert alert-danger small" role="alert">
              {{ errors._ }}
              <NuxtLink v-if="errors.email || errors.token" to="/forgot-password" class="d-block mt-1">再設定のメールを送り直す</NuxtLink>
            </div>
            <div class="mb-3">
              <label for="reset-email" class="form-label">メールアドレス</label>
              <input id="reset-email" :value="email" type="email" class="form-control" autocomplete="username" readonly>
            </div>
            <div class="mb-3">
              <label for="reset-password" class="form-label">新しいパスワード</label>
              <input id="reset-password" v-model="form.password" type="password" class="form-control" :class="{ 'is-invalid': errors.password }" autocomplete="new-password" required>
              <div class="invalid-feedback">{{ errors.password }}</div>
            </div>
            <div class="mb-4">
              <label for="reset-password-confirmation" class="form-label">新しいパスワード(確認)</label>
              <input id="reset-password-confirmation" v-model="form.password_confirmation" type="password" class="form-control" autocomplete="new-password" required>
            </div>
            <button type="submit" class="btn btn-primary w-100" :disabled="submitting">パスワードを再設定する</button>
            <div class="form-text text-center mt-2">再設定すると、ほかの端末のログインも無効になります。</div>
          </form>
        </div>
      </div>
    </div>
  </LayoutSidebarFrame>
</template>
