<script setup lang="ts">
import type { TwoFactorSetup, TwoFactorStatus } from '~/types/api'

// マイページ: 二段階認証の方法の設定。既定はメールの確認コード。
// 「認証アプリを設定する」で QR コードを出し、認証アプリ(Google Authenticator など)に表示されたコードを確かめられたら切り替える。
// 今のパスワードを入れるとメールに戻せる。認証アプリを使えないとき(機種変更など)は、ログインの画面の「メールにコードを送る」を使う
definePageMeta({ middleware: 'auth', layout: 'mypage' })

const requestFetch = useRequestFetch()
const { data: twoFactor } = await useAsyncData('me-two-factor', () => requestFetch<{ data: TwoFactorStatus }>('/api/me/two-factor').then(response => response.data))

const setup = ref<TwoFactorSetup | null>(null)
const code = ref('')
const currentPassword = ref('')
const status = ref('')
const { errors, submitting, submit: send } = useFormSubmit()

// 設定キーを 4 文字ずつ区切って読みやすくする
const formattedSecret = computed(() => setup.value?.secret.match(/.{1,4}/g)?.join(' ') ?? '')
const confirmedAt = computed(() => (twoFactor.value?.confirmed_at ? new Date(twoFactor.value.confirmed_at).toLocaleString('ja-JP') : ''))

async function startSetup() {
  status.value = ''

  await send(async () => {
    setup.value = (await $fetch<{ data: TwoFactorSetup }>('/api/me/two-factor/setup')).data
  })
}

function cancelSetup() {
  setup.value = null
  code.value = ''
  errors.value = {}
}

async function enable() {
  await send(async () => {
    twoFactor.value = (await $fetch<{ data: TwoFactorStatus }>('/api/me/two-factor', { method: 'PUT', body: { code: code.value } })).data
    cancelSetup()
    status.value = '認証アプリでの二段階認証を設定しました。次のログインから、認証アプリのコードを入れてください。'
  })
}

async function disable() {
  status.value = ''

  await send(async () => {
    twoFactor.value = (await $fetch<{ data: TwoFactorStatus }>('/api/me/two-factor', { method: 'DELETE', body: { current_password: currentPassword.value } })).data
    currentPassword.value = ''
    status.value = '認証アプリでの二段階認証をやめ、メールの確認コードに戻しました。'
  })
}

useSeoMeta({ title: '二段階認証', robots: 'noindex' })
</script>

<template>
  <div class="mypage-page mypage-page-narrow">
    <div class="mb-4 d-flex align-items-center justify-content-between">
      <h1 class="h5 mb-0">二段階認証</h1>
    </div>

    <p class="small text-body-secondary">
      ログインのときに、パスワードのあとに入れるコードの受け取り方を選びます。認証アプリを使うと、メールを待たずにログインできます。
      認証アプリを使えないとき(機種変更など)は、ログインの画面の「メールにコードを送る」でメールの確認コードを使えます。
    </p>

    <div v-if="status" class="alert alert-success small" role="status">{{ status }}</div>
    <div v-if="errors._" class="alert alert-danger small" role="alert">{{ errors._ }}</div>

    <div class="card card-body p-4 mb-4">
      <div class="d-flex align-items-center justify-content-between gap-2">
        <span class="fw-semibold">今の方法</span>
        <span class="badge" :class="twoFactor?.method === 'totp' ? 'text-bg-success' : 'text-bg-secondary'" :data-two-factor-method="twoFactor?.method">
          {{ twoFactor?.method === 'totp' ? '認証アプリ(Google Authenticator)' : 'メールの確認コード' }}
        </span>
      </div>
      <div v-if="twoFactor?.method === 'totp'" class="small text-body-secondary mt-1">設定した日時: {{ confirmedAt }}</div>
    </div>

    <!-- 認証アプリをやめてメールに戻す(今のパスワードで本人を確かめる) -->
    <form v-if="twoFactor?.method === 'totp'" class="card card-body p-4" novalidate @submit.prevent="disable">
      <h2 class="h6">メールの確認コードに戻す</h2>
      <p class="small text-body-secondary">端末を替えるときは、いったんメールに戻してから、新しい端末で設定し直してください。</p>
      <div class="mb-3">
        <label for="two-factor-current-password" class="form-label">今のパスワード</label>
        <input id="two-factor-current-password" v-model="currentPassword" type="password" class="form-control" :class="{ 'is-invalid': errors.current_password }" autocomplete="current-password" required>
        <div class="invalid-feedback">{{ errors.current_password }}</div>
      </div>
      <div>
        <button type="submit" class="btn btn-outline-danger" :disabled="submitting">メールに戻す</button>
      </div>
    </form>

    <!-- 認証アプリの設定: QR コードを読み取り、表示されたコードを入れて確かめる -->
    <form v-else-if="setup" class="card card-body p-4" novalidate @submit.prevent="enable">
      <h2 class="h6">認証アプリを設定する</h2>
      <ol class="small ps-3">
        <li>スマートフォンに Google Authenticator などの認証アプリを入れます。</li>
        <li>認証アプリでこの QR コードを読み取ります(読み取れないときは、下の設定キーを入れます)。</li>
        <li>認証アプリに表示された 6 桁のコードを入れて「設定する」を押します。</li>
      </ol>
      <!-- QR コードの SVG は biscuit が作ったもの -->
      <!-- eslint-disable-next-line vue/no-v-html -->
      <div class="text-center my-2" v-html="setup.qr_code_svg" />
      <div class="small text-center mb-3">
        設定キー: <code class="user-select-all">{{ formattedSecret }}</code>
      </div>
      <div class="mb-3">
        <label for="two-factor-code" class="form-label">認証アプリのコード</label>
        <input
          id="two-factor-code"
          v-model="code"
          type="text"
          inputmode="numeric"
          pattern="[0-9 ]*"
          maxlength="7"
          class="form-control text-center fs-4"
          :class="{ 'is-invalid': errors.code }"
          style="letter-spacing: 0.5rem;"
          autocomplete="one-time-code"
          required
        >
        <div class="invalid-feedback">{{ errors.code }}</div>
      </div>
      <div class="d-flex align-items-center gap-3">
        <button type="submit" class="btn btn-primary" :disabled="submitting">設定する</button>
        <button type="button" class="btn btn-link text-secondary p-0" @click="cancelSetup">キャンセル</button>
      </div>
    </form>

    <button v-else type="button" class="btn btn-primary" :disabled="submitting" @click="startSetup">
      <i class="bi bi-phone" /> 認証アプリ(Google Authenticator)を設定する
    </button>
  </div>
</template>
