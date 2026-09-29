<script setup lang="ts">
// マイページ: パスワードの変更(今のパスワードが必要。変更するとほかの端末のログインは無効になる)
definePageMeta({ middleware: 'auth' })

const form = reactive({ current_password: '', password: '', password_confirmation: '' })
const errors = ref<Record<string, string>>({})
const status = ref('')
const saving = ref(false)

async function submit() {
  saving.value = true
  errors.value = {}
  status.value = ''

  try {
    await $fetch('/api/me/password', { method: 'PUT', body: form })
    Object.assign(form, { current_password: '', password: '', password_confirmation: '' })
    status.value = 'パスワードを変更しました。ほかの端末のログインは無効になりました。'
  }
  catch (e) {
    errors.value = validationErrors(e)
    if (Object.keys(errors.value).length === 0) {
      errors.value = { _: errorMessage(e) }
    }
  }
  finally {
    saving.value = false
  }
}

useSeoMeta({ title: 'パスワードの変更', robots: 'noindex' })
</script>

<template>
  <LayoutSidebarFrame
    page-type="other"
    :breadcrumbs="[{ label: 'Home', path: '/' }, { label: 'マイページ', path: '/mypage' }, { label: 'パスワードの変更', path: '/mypage/password' }]"
  >
    <div class="container">
      <div class="row py-5 justify-content-center">
        <div class="col-md-6 col-lg-5">
          <SectionHeading title="Password" subtitle="パスワードの変更" />
          <form class="card card-body shadow-sm" novalidate @submit.prevent="submit">
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
              <button type="submit" class="btn btn-primary" :disabled="saving">変更する</button>
              <NuxtLink to="/mypage" class="text-secondary">マイページへ戻る</NuxtLink>
            </div>
          </form>
        </div>
      </div>
    </div>
  </LayoutSidebarFrame>
</template>
