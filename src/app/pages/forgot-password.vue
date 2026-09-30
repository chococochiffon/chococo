<script setup lang="ts">
// パスワードを忘れたとき: メールアドレスを入力すると、biscuit から再設定のリンクをメールで送る
definePageMeta({ headerNavigation: false })

const email = ref('')
const status = ref('')
const { errors, submitting, submit: send } = useFormSubmit({
  tooManyRequestsMessage: '送信の回数が多すぎます。しばらくしてからもう一度お試しください。',
})

async function submit() {
  status.value = ''

  await send(async () => {
    const response = await $fetch<{ message: string }>('/api/auth/forgot-password', { method: 'POST', body: { email: email.value } })
    status.value = response.message
  })
}

useSeoMeta({ title: 'パスワードの再設定', robots: 'noindex' })
</script>

<template>
  <LayoutSidebarFrame page-type="other">
    <div class="container">
      <div class="row py-5 justify-content-center">
        <div class="col-md-6 col-lg-5 mypage-accent">
          <SectionHeading title="Forgot Password" subtitle="パスワードの再設定" />
          <form class="card card-body shadow-sm" novalidate @submit.prevent="submit">
            <div v-if="status" class="alert alert-success small" role="status">{{ status }}</div>
            <div v-if="errors._" class="alert alert-danger small" role="alert">{{ errors._ }}</div>
            <p class="small text-body-secondary">
              ご登録のメールアドレスを入力してください。パスワードを再設定するためのリンクをお送りします。
            </p>
            <div class="mb-4">
              <label for="forgot-email" class="form-label">メールアドレス</label>
              <input id="forgot-email" v-model="email" type="email" class="form-control" :class="{ 'is-invalid': errors.email }" autocomplete="email" required>
              <div class="invalid-feedback">{{ errors.email }}</div>
            </div>
            <button type="submit" class="btn btn-primary w-100" :disabled="submitting">再設定のメールを送る</button>
            <div class="text-center small mt-3">
              <NuxtLink to="/login">ログインへ戻る</NuxtLink>
            </div>
          </form>
        </div>
      </div>
    </div>
  </LayoutSidebarFrame>
</template>
