<script setup lang="ts">
import type { Me, NameSetting } from '~/types/api'
import type { SkillRow } from '~/components/mypage/SkillRows.vue'

// 招待の受諾: 管理者からの招待のメールのリンク(?token=…&email=…)から開き、アカウント名・パスワード・プロフィールを登録する。
// 登録するとそのままログインした状態になり、マイページへ移る。リンクが無効・期限切れなら、管理者に再送を依頼してもらう
definePageMeta({ headerNavigation: false })

const route = useRoute()
const token = computed(() => (typeof route.query.token === 'string' ? route.query.token : ''))
const email = computed(() => (typeof route.query.email === 'string' ? route.query.email : ''))

// リンクがまだ使えるか(使えれば、アカウント名の初期値としてメールアドレスの @ の前が返る)
const { data: invitation } = await useFetch<{ data: { name: string, email: string } }>('/api/auth/invitation', {
  query: { token, email },
  immediate: !!token.value && !!email.value,
})

const form = reactive({
  name: invitation.value?.data.name ?? '',
  password: '',
  password_confirmation: '',
  first_name: '',
  family_name: '',
  nick_name: '',
  birthday: '',
  comment: '',
  view_flag: false,
  name_settings: 3 as NameSetting,
  skills: [] as SkillRow[],
})
// リンクが無効・期限切れのとき(token のエラー)は、全体のエラーとして出す
const { errors, submitting, submit: send } = useFormSubmit({ generalErrorFields: ['token', 'email'] })

async function submit() {
  await send(async () => {
    const response = await $fetch<{ data: Me }>('/api/auth/invitation', {
      method: 'POST',
      body: {
        token: token.value,
        email: email.value,
        name: form.name,
        password: form.password,
        password_confirmation: form.password_confirmation,
        user_detail: {
          first_name: form.first_name,
          family_name: form.family_name,
          nick_name: form.nick_name,
          birthday: form.birthday,
          comment: form.comment,
          view_flag: form.view_flag,
          name_settings: form.name_settings,
          skills: form.skills.map((skill, index) => ({ name: skill.name, level: skill.level, sort_order: index })),
        },
      },
    })
    useMe().me.value = response.data
    await navigateTo('/mypage')
  })
}

useSeoMeta({ title: 'プロフィールの登録', robots: 'noindex' })
</script>

<template>
  <LayoutSidebarFrame page-type="other">
    <div class="container">
      <div class="row py-5 justify-content-center">
        <div class="col-lg-8 col-xl-7 mypage-accent">
          <SectionHeading title="Welcome" subtitle="プロフィールの登録" />

          <div v-if="!invitation" class="card card-body shadow-sm text-center">
            <p class="mb-0">招待のリンクが無効か、有効期限が切れています。管理者に招待の再送を依頼してください。</p>
          </div>

          <form v-else class="card card-body shadow-sm p-4" novalidate @submit.prevent="submit">
            <p class="small text-body-secondary">
              プロフィールとパスワードを登録すると、マイページにログインできるようになります。
            </p>
            <div v-if="errors._" class="alert alert-danger small" role="alert">{{ errors._ }}</div>

            <div class="row g-3">
              <div class="col-md-6">
                <label for="invitation-name" class="form-label">アカウント名</label>
                <input id="invitation-name" v-model="form.name" type="text" class="form-control" :class="{ 'is-invalid': errors.name }" autocomplete="nickname" required>
                <div class="invalid-feedback">{{ errors.name }}</div>
              </div>
              <div class="col-md-6">
                <label for="invitation-email" class="form-label">メールアドレス</label>
                <input id="invitation-email" :value="invitation.data.email" type="email" class="form-control" autocomplete="username" readonly>
              </div>
              <div class="col-md-6">
                <label for="invitation-password" class="form-label">パスワード</label>
                <input id="invitation-password" v-model="form.password" type="password" class="form-control" :class="{ 'is-invalid': errors.password }" autocomplete="new-password" required>
                <div class="invalid-feedback">{{ errors.password }}</div>
              </div>
              <div class="col-md-6">
                <label for="invitation-password-confirmation" class="form-label">パスワード(確認)</label>
                <input id="invitation-password-confirmation" v-model="form.password_confirmation" type="password" class="form-control" autocomplete="new-password" required>
              </div>
              <div class="col-md-6">
                <label for="invitation-family-name" class="form-label">姓</label>
                <input id="invitation-family-name" v-model="form.family_name" type="text" class="form-control" :class="{ 'is-invalid': errors['user_detail.family_name'] }" required>
                <div class="invalid-feedback">{{ errors['user_detail.family_name'] }}</div>
              </div>
              <div class="col-md-6">
                <label for="invitation-first-name" class="form-label">名</label>
                <input id="invitation-first-name" v-model="form.first_name" type="text" class="form-control" :class="{ 'is-invalid': errors['user_detail.first_name'] }" required>
                <div class="invalid-feedback">{{ errors['user_detail.first_name'] }}</div>
              </div>
              <div class="col-md-6">
                <label for="invitation-nick-name" class="form-label">ニックネーム</label>
                <input id="invitation-nick-name" v-model="form.nick_name" type="text" class="form-control" :class="{ 'is-invalid': errors['user_detail.nick_name'] }" required>
                <div class="invalid-feedback">{{ errors['user_detail.nick_name'] }}</div>
              </div>
              <div class="w-100 mt-0" />
              <div class="col-md-6">
                <label for="invitation-birthday" class="form-label">誕生日</label>
                <input id="invitation-birthday" v-model="form.birthday" type="date" class="form-control" :class="{ 'is-invalid': errors['user_detail.birthday'] }" required>
                <div class="invalid-feedback">{{ errors['user_detail.birthday'] }}</div>
              </div>
              <div class="w-100 mt-0" />
              <div class="col-md-6">
                <label for="invitation-name-settings" class="form-label">公開する名前</label>
                <select id="invitation-name-settings" v-model.number="form.name_settings" class="form-select" :class="{ 'is-invalid': errors['user_detail.name_settings'] }">
                  <option v-for="option in nameSettingOptions" :key="option.value" :value="option.value">{{ option.label }}</option>
                </select>
                <div class="invalid-feedback">{{ errors['user_detail.name_settings'] }}</div>
              </div>
              <div class="col-md-auto d-flex align-items-end">
                <div class="form-check mb-2">
                  <input id="invitation-view-flag" v-model="form.view_flag" type="checkbox" class="form-check-input">
                  <label for="invitation-view-flag" class="form-check-label">プロフィールを公開する</label>
                </div>
              </div>
              <div class="col-12">
                <label for="invitation-comment" class="form-label">コメント</label>
                <textarea id="invitation-comment" v-model="form.comment" class="form-control" rows="4" :class="{ 'is-invalid': errors['user_detail.comment'] }" />
                <div class="invalid-feedback">{{ errors['user_detail.comment'] }}</div>
              </div>
              <div class="col-12">
                <MypageSkillRows v-model="form.skills" :errors="errors" />
              </div>
            </div>

            <div class="mt-4">
              <button type="submit" class="btn btn-primary" :disabled="submitting">登録してマイページへ</button>
              <div class="form-text mt-2">アイコン画像は、登録したあとにマイページのプロフィールで設定できます。</div>
            </div>
          </form>
        </div>
      </div>
    </div>
  </LayoutSidebarFrame>
</template>
