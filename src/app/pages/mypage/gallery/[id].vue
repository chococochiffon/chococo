<script setup lang="ts">
import type { MyGalleryImage } from '~/types/api'

// マイページ: ギャラリーの画像の編集・承認の申請の取り下げ・削除
definePageMeta({ middleware: 'auth', layout: 'mypage' })

const route = useRoute()
const { me } = useMe()
const flash = useState<string>('my-gallery-flash', () => '')

const { data: galleryImage, error } = await useFetch(`/api/me/gallery-images/${route.params.id}`, {
  transform: (response: { data: MyGalleryImage }) => response.data,
})

if (error.value || !galleryImage.value) {
  throw createError({ statusCode: 404, statusMessage: '画像が見つかりません。', fatal: true })
}

const status = ref('')
const { errors: actionErrors, submitting: working, submit } = useFormSubmit({ fieldErrors: false })
// 保存のたびにフォームを保存後の画像で作り直す(ボタン・画像などを最新にする)
const formKey = ref(0)

function onSaved(saved: MyGalleryImage, message: string) {
  galleryImage.value = saved
  formKey.value++
  status.value = message
  actionErrors.value = {}
}

async function withdraw() {
  if (!window.confirm('承認の申請を取り下げて、下書きに戻しますか?')) {
    return
  }

  await submit(async () => {
    onSaved((await $fetch<{ data: MyGalleryImage }>(`/api/me/gallery-images/${galleryImage.value!.id}/withdraw`, { method: 'POST' })).data, '承認の申請を取り下げました。')
  })
}

async function destroy() {
  const warning = galleryImage.value!.approval === 'published' ? '公開中の画像です。削除すると公開側にも表示されなくなります。' : ''

  if (!window.confirm(`${warning}「${galleryImage.value!.name}」を削除しますか?`)) {
    return
  }

  await submit(async () => {
    await $fetch(`/api/me/gallery-images/${galleryImage.value!.id}`, { method: 'DELETE' })
    flash.value = '画像を削除しました。'
    await navigateTo('/mypage/gallery')
  })
}

useSeoMeta({ title: 'ギャラリーの画像の編集', robots: 'noindex' })
</script>

<template>
  <div v-if="galleryImage" class="mypage-page mypage-page-narrow">
    <div class="mb-4 d-flex align-items-center justify-content-between">
      <h1 class="h5 mb-0">ギャラリーの画像の編集</h1>
    </div>

    <div class="d-flex flex-wrap align-items-center gap-2 mb-3">
      <MypageApprovalBadge :approval="galleryImage.approval" />
      <span v-if="galleryImage.approval === 'pending'" class="small text-body-secondary">管理者の承認を待っています。</span>
      <NuxtLink v-if="galleryImage.approval === 'published'" to="/gallery" class="small">ギャラリーを見る</NuxtLink>
      <div class="ms-auto d-flex gap-2">
        <button v-if="galleryImage.approval === 'pending'" type="button" class="btn btn-outline-secondary btn-sm" :disabled="working" @click="withdraw">申請を取り下げる</button>
        <button type="button" class="btn btn-outline-danger btn-sm" :disabled="working" @click="destroy">削除</button>
      </div>
    </div>

    <div v-if="status" class="alert alert-success small" role="status">{{ status }}</div>
    <div v-if="actionErrors._" class="alert alert-danger small" role="alert">{{ actionErrors._ }}</div>
    <div v-if="galleryImage.review_comment" class="alert alert-warning small" role="alert">
      <div class="fw-bold mb-1"><i class="bi bi-exclamation-circle me-1" />管理者から差し戻されました</div>
      <div style="white-space: pre-wrap;">{{ galleryImage.review_comment }}</div>
    </div>
    <div v-if="galleryImage.approval === 'published' && !me?.skip_approval" class="alert alert-info small">
      公開中の画像です。保存すると承認待ちに戻り、管理者が承認するまで公開側には表示されません。
    </div>

    <MypageGalleryImageForm :key="formKey" :gallery-image="galleryImage" @saved="onSaved" />
  </div>
</template>
