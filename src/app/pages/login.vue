<script setup lang="ts">
import type { TwoFactorMethod } from '~/types/api'

// マイページのログイン。ログインできるのは biscuit の管理画面で登録したユーザー(と招待を受けたユーザー)だけ。
// 二段階認証で、メールアドレスとパスワードが正しければ確認コードがメールで届き、そのコードを入れるとログインできる。
// 認証アプリ(Google Authenticator)を設定したユーザーは、メールの代わりに認証アプリのコードを入れる(使えないときは「メールにコードを送る」)
definePageMeta({ headerNavigation: false })

const route = useRoute()
const { me, fetchMe, login, verifyLoginCode, resendLoginCode, sendLoginEmailCode } = useMe()

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

// 確認コードの入力に進んだか・コードの受け取り方(メールか認証アプリか)
const codeSent = ref(false)
const method = ref<TwoFactorMethod>('email')
const status = ref('')
const email = ref('')
const password = ref('')
const code = ref('')
const { errors, submitting, submit: send } = useFormSubmit({
  fieldErrors: false,
  tooManyRequestsMessage: 'ログインの試行回数が多すぎます。しばらくしてからもう一度お試しください。',
  fallbackMessage: 'ログインに失敗しました。',
})

async function submit() {
  await send(async () => {
    method.value = await login(email.value, password.value)
    password.value = ''
    status.value = ''
    codeSent.value = true
  })
}

async function verify() {
  await send(async () => {
    await verifyLoginCode(code.value)
    await navigateTo(redirectTo.value)
  })
}

async function resend() {
  status.value = ''

  await send(async () => {
    await resendLoginCode()
    code.value = ''
    status.value = '確認コードを送り直しました。'
  })
}

// 認証アプリを使えないとき(機種変更など)は、メールの確認コードに切り替える
async function sendEmailCode() {
  status.value = ''

  await send(async () => {
    await sendLoginEmailCode()
    method.value = 'email'
    code.value = ''
    status.value = 'メールに確認コードを送りました。'
  })
}

// メールアドレスの入力からやり直す(コードが届かない・送り直せないとき)
function restart() {
  codeSent.value = false
  code.value = ''
  status.value = ''
  errors.value = {}
}

useSeoMeta({ title: 'ログイン', robots: 'noindex' })
</script>

<template>
  <LayoutSidebarFrame page-type="other">
    <div class="container">
      <div class="row py-5 justify-content-center">
        <div class="col-md-6 col-lg-5 mypage-accent">
          <SectionHeading title="Login" subtitle="ログイン" />

          <form v-if="!codeSent" class="card card-body shadow-sm" novalidate @submit.prevent="submit">
            <div v-if="errors._" class="alert alert-danger small" role="alert">{{ errors._ }}</div>
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

          <form v-else class="card card-body shadow-sm" novalidate @submit.prevent="verify">
            <div v-if="status" class="alert alert-success small" role="status">{{ status }}</div>
            <div v-if="errors._" class="alert alert-danger small" role="alert">{{ errors._ }}</div>
            <p v-if="method === 'totp'" class="small text-body-secondary">
              認証アプリ(Google Authenticator など)に表示されている 6 桁のコードを入力してください。
            </p>
            <p v-else class="small text-body-secondary">
              {{ email }} に確認コードを送りました。メールに書かれた 6 桁のコードを入力してください。
            </p>
            <div class="mb-4">
              <label for="login-code" class="form-label">{{ method === 'totp' ? '認証アプリのコード' : '確認コード' }}</label>
              <input
                id="login-code"
                v-model="code"
                type="text"
                inputmode="numeric"
                pattern="[0-9]*"
                maxlength="6"
                class="form-control text-center fs-4"
                style="letter-spacing: 0.5rem;"
                autocomplete="one-time-code"
                required
              >
            </div>
            <button type="submit" class="btn btn-primary w-100" :disabled="submitting">ログイン</button>
            <div class="d-flex justify-content-between small mt-3">
              <button v-if="method === 'totp'" type="button" class="btn btn-link btn-sm p-0" :disabled="submitting" @click="sendEmailCode">メールにコードを送る</button>
              <button v-else type="button" class="btn btn-link btn-sm p-0" :disabled="submitting" @click="resend">コードを送り直す</button>
              <button type="button" class="btn btn-link btn-sm p-0 text-secondary" @click="restart">メールアドレスの入力に戻る</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </LayoutSidebarFrame>
</template>
