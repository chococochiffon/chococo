<script setup lang="ts">
import { MAX_SKILL_LEVEL, type NameSetting } from '~/types/api'

// マイページのプロフィール(名前・メールアドレス・ユーザー詳細・スキル)とアイコン画像の変更
definePageMeta({ middleware: 'auth', layout: 'mypage' })

const { me } = useMe()

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

const status = ref('')
const { errors, submitting: saving, submit } = useFormSubmit()

function addSkill() {
  form.skills.push({ id: null, name: '', level: 1 })
}

function removeSkill(index: number) {
  form.skills.splice(index, 1)
}

async function saveProfile() {
  status.value = ''

  await submit(async () => {
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
  })
}

// アイコン画像は選んだらすぐに保存する(biscuit が中央で正方形に切り抜く)
const { errors: imageErrors, submitting: uploading, submit: submitImage } = useFormSubmit({ fieldErrors: false, fallbackMessage: '画像の保存に失敗しました。' })

async function uploadImage(file: File) {
  await submitImage(async () => {
    const body = new FormData()
    body.append('image', file)
    const response = await $fetch<{ data: typeof me.value }>('/api/me/profile/image', { method: 'POST', body })
    me.value = response.data
  })
}

useSeoMeta({ title: 'プロフィール', robots: 'noindex' })
</script>

<template>
  <div class="mypage-profile">
    <div class="mb-4 d-flex align-items-center justify-content-between">
      <h1 class="h5 mb-0">プロフィール</h1>
      <!-- 「プロフィールを公開する」がオンなら、公開側の投稿者ページがある -->
      <NuxtLink v-if="me?.detail?.view_flag" :to="`/authors/${me.id}`" class="btn btn-outline-secondary btn-sm" target="_blank">
        <i class="bi bi-box-arrow-up-right me-1" />公開中の投稿者ページを見る
      </NuxtLink>
    </div>

    <div class="row g-4">
      <div class="col-lg-4 mypage-profile-image-col order-lg-2">
        <div class="card card-body p-4">
          <h2 class="h6 fw-bold mb-3">アイコン画像</h2>
          <div class="text-center">
            <img v-if="me?.detail" :src="me.detail.user_image_url" alt="" class="rounded-circle border mb-3" width="128" height="128">
            <MypageImageDrop label="アイコン画像を選択" :disabled="uploading || !me?.detail" @select="uploadImage" />
            <div class="form-text">画像は中央を正方形に切り抜いて保存します。</div>
            <div v-if="imageErrors._" class="text-danger small mt-1">{{ imageErrors._ }}</div>
          </div>
        </div>
      </div>

      <div class="col-lg-8 mypage-profile-form-col order-lg-1">
        <form class="card card-body p-4" novalidate @submit.prevent="saveProfile">
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
            <!-- 項目のまとまりごとに改行する(g-3 の上余白が付かないよう mt-0) -->
            <div class="w-100 mt-0" />
            <div class="col-md-6">
              <label for="me-family-name" class="form-label">姓</label>
              <input id="me-family-name" v-model="form.family_name" type="text" class="form-control" :class="{ 'is-invalid': errors['user_detail.family_name'] }" required>
              <div class="invalid-feedback">{{ errors['user_detail.family_name'] }}</div>
            </div>
            <div class="col-md-6">
              <label for="me-first-name" class="form-label">名</label>
              <input id="me-first-name" v-model="form.first_name" type="text" class="form-control" :class="{ 'is-invalid': errors['user_detail.first_name'] }" required>
              <div class="invalid-feedback">{{ errors['user_detail.first_name'] }}</div>
            </div>
            <div class="w-100 mt-0" />
            <div class="col-md-6">
              <label for="me-nick-name" class="form-label">ニックネーム</label>
              <input id="me-nick-name" v-model="form.nick_name" type="text" class="form-control" :class="{ 'is-invalid': errors['user_detail.nick_name'] }" required>
              <div class="invalid-feedback">{{ errors['user_detail.nick_name'] }}</div>
            </div>
            <div class="w-100 mt-0" />
            <div class="col-md-6">
              <label for="me-birthday" class="form-label">誕生日</label>
              <input id="me-birthday" v-model="form.birthday" type="date" class="form-control" :class="{ 'is-invalid': errors['user_detail.birthday'] }" required>
              <div class="invalid-feedback">{{ errors['user_detail.birthday'] }}</div>
            </div>
            <div class="w-100 mt-0" />
            <div class="col-md-6">
              <label for="me-name-settings" class="form-label">公開する名前</label>
              <select id="me-name-settings" v-model.number="form.name_settings" class="form-select" :class="{ 'is-invalid': errors['user_detail.name_settings'] }">
                <option v-for="option in nameSettingOptions" :key="option.value" :value="option.value">{{ option.label }}</option>
              </select>
              <div class="invalid-feedback">{{ errors['user_detail.name_settings'] }}</div>
            </div>
            <div class="col-md-auto d-flex align-items-end">
              <div class="form-check mb-2">
                <input id="me-view-flag" v-model="form.view_flag" type="checkbox" class="form-check-input">
                <label for="me-view-flag" class="form-check-label">プロフィールを公開する</label>
              </div>
            </div>
            <div class="w-100 mt-0" />
            <div class="col-12">
              <label for="me-comment" class="form-label">コメント</label>
              <textarea id="me-comment" v-model="form.comment" class="form-control" rows="6" :class="{ 'is-invalid': errors['user_detail.comment'] }" />
              <div class="invalid-feedback">{{ errors['user_detail.comment'] }}</div>
            </div>

            <div class="col-12">
              <div class="form-label">スキル</div>
              <div v-for="(skill, index) in form.skills" :key="skill.id ?? `new-${index}`" class="row g-2 align-items-start mb-2">
                <div class="col-7 col-md-5">
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
</template>
