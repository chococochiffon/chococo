<script setup lang="ts">
import type { MyArticle } from '~/types/api'

// マイページ: 記事の編集・承認の申請の取り下げ・削除
definePageMeta({ middleware: 'auth', layout: 'mypage' })

const route = useRoute()
const { me } = useMe()
const flash = useState<string>('my-articles-flash', () => '')

const { data: article, error } = await useFetch(`/api/me/articles/${route.params.id}`, {
  transform: (response: { data: MyArticle }) => response.data,
})

if (error.value || !article.value) {
  throw createError({ statusCode: 404, statusMessage: '記事が見つかりません。', fatal: true })
}

const status = ref('')
const { errors: actionErrors, submitting: working, submit } = useFormSubmit({ fieldErrors: false })
// 保存のたびにフォームを保存後の記事で作り直す(ボタン・サムネイル画像などを最新にする)
const formKey = ref(0)

function onSaved(saved: MyArticle, message: string) {
  article.value = saved
  formKey.value++
  status.value = message
  actionErrors.value = {}
}

async function withdraw() {
  if (!window.confirm('承認の申請を取り下げて、下書きに戻しますか?')) {
    return
  }

  await submit(async () => {
    onSaved((await $fetch<{ data: MyArticle }>(`/api/me/articles/${article.value!.id}/withdraw`, { method: 'POST' })).data, '承認の申請を取り下げました。')
  })
}

async function destroy() {
  const warning = article.value!.approval === 'published' ? '公開中の記事です。削除すると公開側にも表示されなくなります。' : ''

  if (!window.confirm(`${warning}「${article.value!.title}」を削除しますか?`)) {
    return
  }

  await submit(async () => {
    await $fetch(`/api/me/articles/${article.value!.id}`, { method: 'DELETE' })
    flash.value = '記事を削除しました。'
    await navigateTo('/mypage/articles')
  })
}

useSeoMeta({ title: '記事の編集', robots: 'noindex' })
</script>

<template>
  <div v-if="article" class="mypage-page">
    <div class="mb-4 d-flex align-items-center justify-content-between">
      <h1 class="h5 mb-0">記事の編集</h1>
    </div>

    <div class="d-flex flex-wrap align-items-center gap-2 mb-3">
      <MypageApprovalBadge :approval="article.approval" />
      <span v-if="article.approval === 'pending'" class="small text-body-secondary">管理者の承認を待っています。</span>
      <NuxtLink v-if="article.approval === 'published'" :to="article.path" class="small">公開中のページを見る</NuxtLink>
      <div class="ms-auto d-flex gap-2">
        <button v-if="article.approval === 'pending'" type="button" class="btn btn-outline-secondary btn-sm" :disabled="working" @click="withdraw">申請を取り下げる</button>
        <button type="button" class="btn btn-outline-danger btn-sm" :disabled="working" @click="destroy">削除</button>
      </div>
    </div>

    <div v-if="status" class="alert alert-success small" role="status">{{ status }}</div>
    <div v-if="actionErrors._" class="alert alert-danger small" role="alert">{{ actionErrors._ }}</div>
    <div v-if="article.review_comment" class="alert alert-warning small" role="alert">
      <div class="fw-bold mb-1"><i class="bi bi-exclamation-circle me-1" />管理者から差し戻されました</div>
      <div style="white-space: pre-wrap;">{{ article.review_comment }}</div>
    </div>
    <div v-if="article.approval === 'published' && !me?.skip_approval" class="alert alert-info small">
      公開中の記事です。保存すると承認待ちに戻り、管理者が承認するまで公開側には表示されません。
    </div>

    <MypageArticleForm :key="formKey" :article="article" @saved="onSaved" />
  </div>
</template>
