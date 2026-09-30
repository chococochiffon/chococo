<script setup lang="ts">
import type { ArticleApproval } from '~/types/api'

// 編集画面の上に出す、公開ステータスと操作(申請の取り下げ・削除)、操作の結果・差し戻しの理由・公開中の編集の注意
defineProps<{
  approval: ArticleApproval
  reviewComment: string | null
  // 確認の文言に使う名前(記事・画像)
  noun: string
  // 公開中のときに出す、公開側を見るリンク
  publicLink: { to: string, label: string }
  status: string
  error?: string
  working: boolean
}>()

defineEmits<{
  withdraw: []
  destroy: []
}>()

const { me } = useMe()
</script>

<template>
  <div>
    <div class="d-flex flex-wrap align-items-center gap-2 mb-3">
      <MypageApprovalBadge :approval="approval" />
      <span v-if="approval === 'pending'" class="small text-body-secondary">管理者の承認を待っています。</span>
      <NuxtLink v-if="approval === 'published'" :to="publicLink.to" class="small">{{ publicLink.label }}</NuxtLink>
      <div class="ms-auto d-flex gap-2">
        <button v-if="approval === 'pending'" type="button" class="btn btn-outline-secondary btn-sm" :disabled="working" @click="$emit('withdraw')">申請を取り下げる</button>
        <button type="button" class="btn btn-outline-danger btn-sm" :disabled="working" @click="$emit('destroy')">削除</button>
      </div>
    </div>

    <div v-if="status" class="alert alert-success small" role="status">{{ status }}</div>
    <div v-if="error" class="alert alert-danger small" role="alert">{{ error }}</div>
    <div v-if="reviewComment" class="alert alert-warning small" role="alert">
      <div class="fw-bold mb-1"><i class="bi bi-exclamation-circle me-1" />管理者から差し戻されました</div>
      <div style="white-space: pre-wrap;">{{ reviewComment }}</div>
    </div>
    <div v-if="approval === 'published' && !me?.skip_approval" class="alert alert-info small">
      公開中の{{ noun }}です。保存すると承認待ちに戻り、管理者が承認するまで公開側には表示されません。
    </div>
  </div>
</template>
