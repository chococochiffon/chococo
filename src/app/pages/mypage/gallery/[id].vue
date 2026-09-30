<script setup lang="ts">
import type { MyGalleryImage } from '~/types/api'

// マイページ: ギャラリーの画像の編集・承認の申請の取り下げ・削除
definePageMeta({ middleware: 'auth', layout: 'mypage' })

const route = useRoute()

const { data: galleryImage, error } = await useFetch(`/api/me/gallery-images/${route.params.id}`, {
  transform: (response: { data: MyGalleryImage }) => response.data,
})

if (error.value || !galleryImage.value) {
  throw createError({ statusCode: 404, statusMessage: '画像が見つかりません。', fatal: true })
}

const { status, errors: actionErrors, working, formKey, onSaved, withdraw, destroy } = useMyApprovalActions(galleryImage, {
  endpoint: '/api/me/gallery-images',
  listPath: '/mypage/gallery',
  flashKey: 'my-gallery-flash',
  noun: '画像',
  name: galleryImage => galleryImage.name,
})

useSeoMeta({ title: 'ギャラリーの画像の編集', robots: 'noindex' })
</script>

<template>
  <div v-if="galleryImage" class="mypage-page mypage-page-narrow">
    <div class="mb-4 d-flex align-items-center justify-content-between">
      <h1 class="h5 mb-0">ギャラリーの画像の編集</h1>
    </div>

    <MypageApprovalStatusBar
      :approval="galleryImage.approval"
      :review-comment="galleryImage.review_comment"
      noun="画像"
      :public-link="{ to: '/gallery', label: 'ギャラリーを見る' }"
      :status="status"
      :error="actionErrors._"
      :working="working"
      @withdraw="withdraw"
      @destroy="destroy"
    />

    <MypageGalleryImageForm :key="formKey" :gallery-image="galleryImage" @saved="onSaved" />
  </div>
</template>
