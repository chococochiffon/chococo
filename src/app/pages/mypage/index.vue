<script setup lang="ts">
import { MAX_SKILL_LEVEL, type NameSetting } from '~/types/api'

// マイページ: プロフィール(名前・メールアドレス・ユーザー詳細・スキル)とアイコン画像の変更
definePageMeta({ middleware: 'auth' })

const { me, logout } = useMe()

const nameSettingOptions: { value: NameSetting, label: string }[] = [
  { value: 1, label: '非表示' },
  { value: 2, label: 'フルネーム' },
  { value: 3, label: 'ニックネーム' },
  { value: 4, label: '名前のみ' },
]

interface SkillRow {
  id: number | null
  name: string
  level: number
}

// 編集中の値(保存するまで me は変えない)
const form = reactive({
  name: me.value?.name ?? '',
  email: me.value?.email ?? '',
  first_name: me.value?.detail?.first_name ?? '',
  family_name: me.value?.detail?.family_name ?? '',
  nick_name: me.value?.detail?.nick_name ?? '',
  birthday: me.value?.detail?.birthday ?? '',
  comment: me.value?.detail?.comment ?? '',
  view_flag: me.value?.detail?.view_flag ?? false,
  name_settings: (me.value?.detail?.name_settings ?? 3) as NameSetting,
  skills: (me.value?.detail?.skills ?? []).map(skill => ({ id: skill.id, name: skill.name, level: skill.level })) as SkillRow[],
})

const errors = ref<Record<string, string>>({})
const status = ref('')
const saving = ref(false)

function addSkill() {
  form.skills.push({ id: null, name: '', level: 1 })
}

function removeSkill(index: number) {
  form.skills.splice(index, 1)
}

async function saveProfile() {
  saving.value = true
  errors.value = {}
  status.value = ''

  try {
    const response = await $fetch<{ data: typeof me.value }>('/api/me/profile', {
      method: 'PUT',
      body: {
        name: form.name,
        email: form.email,
        user_detail: {
          first_name: form.first_name,
          family_name: form.family_name,
          nick_name: form.nick_name,
          birthday: form.birthday,
          comment: form.comment,
          view_flag: form.view_flag,
          name_settings: form.name_settings,
          // 画面上の順番を並び順にする
          skills: form.skills.map((skill, index) => ({ ...(skill.id ? { id: skill.id } : {}), name: skill.name, level: skill.level, sort_order: index })),
        },
      },
    })
    me.value = response.data
    form.skills = (response.data?.detail?.skills ?? []).map(skill => ({ id: skill.id, name: skill.name, level: skill.level }))
    status.value = 'プロフィールを保存しました。'
  }
  catch (e) {
    errors.value = validationErrors(e)
    status.value = ''
    if (Object.keys(errors.value).length === 0) {
      errors.value = { _: errorMessage(e) }
    }
  }
  finally {
    saving.value = false
  }
}

// アイコン画像は選んだらすぐに保存する(biscuit が中央で正方形に切り抜く)
const imageError = ref('')
const uploading = ref(false)

async function uploadImage(event: Event) {
  const file = (event.target as HTMLInputElement).files?.[0]

  if (!file) {
    return
  }

  uploading.value = true
  imageError.value = ''

  try {
    const body = new FormData()
    body.append('image', file)
    const response = await $fetch<{ data: typeof me.value }>('/api/me/profile/image', { method: 'POST', body })
    me.value = response.data
  }
  catch (e) {
    imageError.value = errorMessage(e, '画像の保存に失敗しました。')
  }
  finally {
    uploading.value = false
    ;(event.target as HTMLInputElement).value = ''
  }
}

async function onLogout() {
  await logout()
  await navigateTo('/')
}

useSeoMeta({ title: 'マイページ', robots: 'noindex' })
</script>

<template>
  <LayoutSidebarFrame page-type="other" :breadcrumbs="[{ label: 'Home', path: '/' }, { label: 'マイページ', path: '/mypage' }]">
    <div class="container">
      <div class="row py-5 justify-content-center">
        <div class="col-lg-9">
          <SectionHeading title="My Page" subtitle="マイページ" />

          <div class="d-flex justify-content-end gap-3 mb-3 small">
            <NuxtLink to="/mypage/password">パスワードの変更</NuxtLink>
            <button type="button" class="btn btn-link btn-sm p-0" @click="onLogout">ログアウト</button>
          </div>

          <div class="card card-body shadow-sm mb-4">
            <h2 class="h6 fw-bold mb-3">アイコン画像</h2>
            <div class="d-flex align-items-center gap-3">
              <img v-if="me?.detail" :src="me.detail.user_image_url" alt="" class="rounded-circle border" width="96" height="96">
              <div>
                <input type="file" accept="image/*" class="form-control form-control-sm" :disabled="uploading || !me?.detail" @change="uploadImage">
                <div class="form-text">画像は中央を正方形に切り抜いて保存します。</div>
                <div v-if="imageError" class="text-danger small mt-1">{{ imageError }}</div>
              </div>
            </div>
          </div>

          <form class="card card-body shadow-sm" novalidate @submit.prevent="saveProfile">
            <h2 class="h6 fw-bold mb-3">プロフィール</h2>
            <div v-if="status" class="alert alert-success small" role="status">{{ status }}</div>
            <div v-if="errors._" class="alert alert-danger small" role="alert">{{ errors._ }}</div>

            <div class="row g-3">
              <div class="col-md-6">
                <label for="me-name" class="form-label">アカウント名</label>
                <input id="me-name" v-model="form.name" type="text" class="form-control" :class="{ 'is-invalid': errors.name }" required>
                <div class="invalid-feedback">{{ errors.name }}</div>
              </div>
              <div class="col-md-6">
                <label for="me-email" class="form-label">メールアドレス</label>
                <input id="me-email" v-model="form.email" type="email" class="form-control" :class="{ 'is-invalid': errors.email }" autocomplete="email" required>
                <div class="invalid-feedback">{{ errors.email }}</div>
              </div>
              <div class="col-md-4">
                <label for="me-family-name" class="form-label">姓</label>
                <input id="me-family-name" v-model="form.family_name" type="text" class="form-control" :class="{ 'is-invalid': errors['user_detail.family_name'] }" required>
                <div class="invalid-feedback">{{ errors['user_detail.family_name'] }}</div>
              </div>
              <div class="col-md-4">
                <label for="me-first-name" class="form-label">名</label>
                <input id="me-first-name" v-model="form.first_name" type="text" class="form-control" :class="{ 'is-invalid': errors['user_detail.first_name'] }" required>
                <div class="invalid-feedback">{{ errors['user_detail.first_name'] }}</div>
              </div>
              <div class="col-md-4">
                <label for="me-nick-name" class="form-label">ニックネーム</label>
                <input id="me-nick-name" v-model="form.nick_name" type="text" class="form-control" :class="{ 'is-invalid': errors['user_detail.nick_name'] }" required>
                <div class="invalid-feedback">{{ errors['user_detail.nick_name'] }}</div>
              </div>
              <div class="col-md-4">
                <label for="me-birthday" class="form-label">誕生日</label>
                <input id="me-birthday" v-model="form.birthday" type="date" class="form-control" :class="{ 'is-invalid': errors['user_detail.birthday'] }" required>
                <div class="invalid-feedback">{{ errors['user_detail.birthday'] }}</div>
              </div>
              <div class="col-md-4">
                <label for="me-name-settings" class="form-label">公開する名前</label>
                <select id="me-name-settings" v-model.number="form.name_settings" class="form-select" :class="{ 'is-invalid': errors['user_detail.name_settings'] }">
                  <option v-for="option in nameSettingOptions" :key="option.value" :value="option.value">{{ option.label }}</option>
                </select>
                <div class="invalid-feedback">{{ errors['user_detail.name_settings'] }}</div>
              </div>
              <div class="col-md-4 d-flex align-items-end">
                <div class="form-check mb-2">
                  <input id="me-view-flag" v-model="form.view_flag" type="checkbox" class="form-check-input">
                  <label for="me-view-flag" class="form-check-label">プロフィールを公開する</label>
                </div>
              </div>
              <div class="col-12">
                <label for="me-comment" class="form-label">コメント</label>
                <textarea id="me-comment" v-model="form.comment" class="form-control" rows="3" :class="{ 'is-invalid': errors['user_detail.comment'] }" />
                <div class="invalid-feedback">{{ errors['user_detail.comment'] }}</div>
              </div>

              <div class="col-12">
                <div class="form-label">スキル</div>
                <div v-for="(skill, index) in form.skills" :key="skill.id ?? `new-${index}`" class="row g-2 align-items-start mb-2">
                  <div class="col">
                    <input
                      v-model="skill.name"
                      type="text"
                      class="form-control form-control-sm"
                      :class="{ 'is-invalid': errors[`user_detail.skills.${index}.name`] }"
                      placeholder="スキル名"
                      aria-label="スキル名"
                    >
                    <div class="invalid-feedback">{{ errors[`user_detail.skills.${index}.name`] }}</div>
                  </div>
                  <div class="col-auto">
                    <select v-model.number="skill.level" class="form-select form-select-sm" aria-label="習熟度">
                      <option v-for="level in MAX_SKILL_LEVEL" :key="level" :value="level">{{ '★'.repeat(level) }}</option>
                    </select>
                  </div>
                  <div class="col-auto">
                    <button type="button" class="btn btn-outline-danger btn-sm" aria-label="削除" @click="removeSkill(index)">−</button>
                  </div>
                </div>
                <button type="button" class="btn btn-outline-secondary btn-sm" @click="addSkill">+ スキルを追加</button>
              </div>
            </div>

            <div class="mt-4">
              <button type="submit" class="btn btn-primary" :disabled="saving">保存する</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </LayoutSidebarFrame>
</template>
