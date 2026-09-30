<script setup lang="ts">
import type { MyArticle } from '~/types/api'

// マイページ: 記事の編集・承認の申請の取り下げ・削除
definePageMeta({ middleware: 'auth', layout: 'mypage' })

const route = useRoute()

const { data: article, error } = await useFetch(`/api/me/articles/${route.params.id}`, {
  transform: (response: { data: MyArticle }) => response.data,
})

if (error.value || !article.value) {
  throw createError({ statusCode: 404, statusMessage: '記事が見つかりません。', fatal: true })
}

const { status, errors: actionErrors, working, formKey, onSaved, withdraw, destroy } = useMyApprovalActions(article, {
  endpoint: '/api/me/articles',
  listPath: '/mypage/articles',
  flashKey: 'my-articles-flash',
  noun: '記事',
  name: article => article.title,
})

useSeoMeta({ title: '記事の編集', robots: 'noindex' })
</script>

<template>
  <div v-if="article" class="mypage-page">
    <div class="mb-4 d-flex align-items-center justify-content-between">
      <h1 class="h5 mb-0">記事の編集</h1>
    </div>

    <MypageApprovalStatusBar
      :approval="article.approval"
      :review-comment="article.review_comment"
      noun="記事"
      :public-link="{ to: article.path, label: '公開中のページを見る' }"
      :status="status"
      :error="actionErrors._"
      :working="working"
      @withdraw="withdraw"
      @destroy="destroy"
    />

    <MypageArticleForm :key="formKey" :article="article" @saved="onSaved" />
  </div>
</template>
