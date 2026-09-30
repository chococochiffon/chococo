<script setup lang="ts">
import type { MyDashboard } from '~/types/api'

// ダッシュボードの「アカウント」(公開のしかた・投稿者ページ・最近のログイン)
defineProps<{
  account: MyDashboard['account']
}>()
</script>

<template>
  <div class="card h-100">
    <div class="card-header bg-transparent fw-semibold">アカウント</div>
    <div class="card-body">
      <dl class="row small mb-0">
        <dt class="col-5 fw-normal text-body-secondary">公開のしかた</dt>
        <dd class="col-7">{{ account.skip_approval ? '承認なしで公開' : '管理者の承認後に公開' }}</dd>
        <dt class="col-5 fw-normal text-body-secondary">投稿者ページ</dt>
        <dd class="col-7">
          <NuxtLink v-if="account.profile_path" :to="account.profile_path">公開中</NuxtLink>
          <template v-else>非公開(<NuxtLink to="/mypage/profile">プロフィール</NuxtLink>で変更できます)</template>
        </dd>
        <dt class="col-5 fw-normal text-body-secondary">最近のログイン</dt>
        <dd class="col-7 mb-0">
          <div v-for="login in account.recent_logins" :key="login">{{ formatDateTime(login) }}</div>
          <span v-if="account.recent_logins.length === 0" class="text-body-secondary">記録はありません。</span>
        </dd>
      </dl>
    </div>
  </div>
</template>
