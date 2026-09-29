<script setup lang="ts">
// マイページ: パスワードの変更(今のパスワードが必要。変更するとほかの端末のログインは無効になる)
definePageMeta({ middleware: 'auth', layout: 'mypage' })

const form = reactive({ current_password: '', password: '', password_confirmation: '' })
const status = ref('')
const { errors, submitting: saving, submit: send } = useFormSubmit()

async function submit() {
  status.value = ''

  await send(async () => {
    await $fetch('/api/me/password', { method: 'PUT', body: form })
    Object.assign(form, { current_password: '', password: '', password_confirmation: '' })
    status.value = 'パスワードを変更しました。ほかの端末のログインは無効になりました。'
  })
}

useSeoMeta({ title: 'パスワードの変更', robots: 'noindex' })
</script>

<template>
  <div>
    <div class="mb-4 d-flex align-items-center justify-content-between">
      <h1 class="h5 mb-0">パスワードの変更</h1>
    </div>

    <div class="row">
      <div class="col-md-8 col-lg-6 col-xl-5">
        <form class="card card-body p-4" novalidate @submit.prevent="submit">
          <div v-if="status" class="alert alert-success small" role="status">{{ status }}</div>
          <div v-if="errors._" class="alert alert-danger small" role="alert">{{ errors._ }}</div>
          <div class="mb-3">
            <label for="current-password" class="form-label">今のパスワード</label>
            <input id="current-password" v-model="form.current_password" type="password" class="form-control" :class="{ 'is-invalid': errors.current_password }" autocomplete="current-password" required>
            <div class="invalid-feedback">{{ errors.current_password }}</div>
          </div>
          <div class="mb-3">
            <label for="new-password" class="form-label">新しいパスワード</label>
            <input id="new-password" v-model="form.password" type="password" class="form-control" :class="{ 'is-invalid': errors.password }" autocomplete="new-password" required>
            <div class="invalid-feedback">{{ errors.password }}</div>
          </div>
          <div class="mb-4">
            <label for="new-password-confirmation" class="form-label">新しいパスワード(確認)</label>
            <input id="new-password-confirmation" v-model="form.password_confirmation" type="password" class="form-control" autocomplete="new-password" required>
          </div>
          <div class="d-flex align-items-center gap-3">
            <button type="submit" class="btn btn-primary text-nowrap" :disabled="saving">変更する</button>
            <div class="form-text m-0">変更すると、ほかの端末のログインは無効になります。</div>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>
