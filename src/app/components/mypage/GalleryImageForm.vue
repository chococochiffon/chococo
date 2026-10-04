<script setup lang="ts">
import type { MyGalleryImage } from '~/types/api'

// マイページのギャラリーの画像の投稿・編集フォーム(画像・名前・分類・コメント)。
// 新規作成は画像と項目をまとめて送り、編集は項目の保存 → (画像を選び直したときは)画像の保存 の順に送る。
// 申請するときは最後に承認を申請し、保存後の画像を saved で返す。承認の流れは記事(ArticleForm)と同じで、
// 公開中の画像は保存すると biscuit が承認待ちに戻す。承認を飛ばす権限のあるユーザーは、申請でそのまま公開になり、公開中のまま保存できる
const props = defineProps<{
  // 編集する画像(新規作成なら null)
  galleryImage: MyGalleryImage | null
}>()

const emit = defineEmits<{
  saved: [galleryImage: MyGalleryImage, message: string]
}>()

const { me } = useMe()
const skipsApproval = computed(() => me.value?.skip_approval ?? false)
const { data: categories } = await useGalleryCategories()

const form = reactive({
  name: props.galleryImage?.name ?? '',
  categoryId: props.galleryImage?.category?.id ?? null as number | null,
  comment: props.galleryImage?.comment ?? '',
})
// 選んだ画像(保存するまでは手元でプレビューする)
const { file, preview, select: setFile } = useFilePreview()
const { errors, submitting: saving, submit } = useFormSubmit({ generalErrorFields: ['approval'] })

const approval = computed(() => props.galleryImage?.approval ?? 'draft')

async function save(submitAfterSave: boolean) {
  if (!confirmSavingPublished(approval.value, skipsApproval.value, '画像')) {
    return
  }

  await submit(async () => {
    let galleryImage: MyGalleryImage

    if (props.galleryImage) {
      galleryImage = (await $fetch<{ data: MyGalleryImage }>(`/api/me/gallery-images/${props.galleryImage.id}`, {
        method: 'PUT',
        body: { name: form.name, gallery_category_id: form.categoryId, comment: form.comment },
      })).data

      if (file.value) {
        const body = new FormData()
        body.append('image', file.value)
        galleryImage = (await $fetch<{ data: MyGalleryImage }>(`/api/me/gallery-images/${galleryImage.id}/image`, { method: 'POST', body })).data
      }
    }
    else {
      const body = new FormData()

      if (file.value) {
        body.append('image', file.value)
      }

      body.append('name', form.name)
      body.append('comment', form.comment)

      if (form.categoryId !== null) {
        body.append('gallery_category_id', String(form.categoryId))
      }

      galleryImage = (await $fetch<{ data: MyGalleryImage }>('/api/me/gallery-images', { method: 'POST', body })).data
    }

    setFile(null)

    galleryImage = await submitAfterSaving(galleryImage, '/api/me/gallery-images', submitAfterSave)

    emit('saved', galleryImage, approvalSavedMessage('画像', approval.value, galleryImage.approval))
  })
}
</script>

<template>
  <form class="card card-body p-4" novalidate @submit.prevent="save(false)">
    <div v-if="errors._" class="alert alert-danger small" role="alert">{{ errors._ }}</div>

    <div class="mb-3">
      <label for="my-gallery-image" class="form-label" :class="{ 'is-required': !galleryImage }">画像</label>
      <img v-if="preview || galleryImage" :src="preview ?? galleryImage?.image_url ?? ''" alt="" class="img-fluid rounded border d-block mb-2" style="max-height: 16rem;">
      <MypageImageDrop id="my-gallery-image" label="ギャラリーの画像を選択" :invalid="!!errors.image" @select="setFile" />
      <div v-if="errors.image" class="invalid-feedback d-block">{{ errors.image }}</div>
      <div class="form-text">
        長辺が 1200px を超える画像は、比率を保ったまま縮小して保存します。
        <template v-if="galleryImage">変更しない場合は選択不要です。</template>
      </div>
    </div>

    <div class="mb-3">
      <label for="my-gallery-name" class="form-label">名前</label>
      <input id="my-gallery-name" v-model="form.name" type="text" class="form-control" :class="{ 'is-invalid': errors.name }" maxlength="128" required>
      <div class="invalid-feedback">{{ errors.name }}</div>
    </div>

    <div class="mb-3">
      <label for="my-gallery-category" class="form-label">分類</label>
      <select id="my-gallery-category" v-model="form.categoryId" class="form-select w-auto" :class="{ 'is-invalid': errors.gallery_category_id }">
        <option :value="null">未分類</option>
        <option v-for="category in categories ?? []" :key="category.id" :value="category.id">{{ category.name }}</option>
      </select>
      <div class="invalid-feedback">{{ errors.gallery_category_id }}</div>
    </div>

    <div class="mb-4">
      <label for="my-gallery-comment" class="form-label">コメント</label>
      <input id="my-gallery-comment" v-model="form.comment" type="text" class="form-control" :class="{ 'is-invalid': errors.comment }" maxlength="255">
      <div class="invalid-feedback">{{ errors.comment }}</div>
    </div>

    <div class="d-flex flex-wrap align-items-center gap-2">
      <template v-if="approval === 'draft'">
        <button type="submit" class="btn btn-outline-primary" :disabled="saving">下書き保存</button>
        <button type="button" class="btn btn-primary" :disabled="saving" @click="save(true)">{{ skipsApproval ? '保存して公開' : '保存して承認を申請' }}</button>
      </template>
      <button v-else-if="approval === 'pending'" type="submit" class="btn btn-primary" :disabled="saving">保存する</button>
      <button v-else type="submit" class="btn btn-primary" :disabled="saving">{{ skipsApproval ? '保存する' : '保存して承認を申請し直す' }}</button>
      <NuxtLink to="/mypage/gallery" class="text-secondary ms-2">キャンセル</NuxtLink>
    </div>
  </form>
</template>
