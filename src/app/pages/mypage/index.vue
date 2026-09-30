<script setup lang="ts">
import type { MyDashboard, MyPageViews } from '~/types/api'

// マイページのダッシュボード(ログイン後の既定の画面)。管理画面のダッシュボードの項目を自分の分に絞って表示する:
// 記事・ギャラリーの状況、最近編集したもの、クイック操作、公開予定、コンテンツチェック、最近の操作、アカウント、画像と、
// 自分の記事のアクセス。サイト全体の数字は出さない。各枠は components/mypage/dashboard/ の部品
definePageMeta({ middleware: 'auth', layout: 'mypage' })

const [{ data: dashboardResponse, error: dashboardError }, { data: pageViewsResponse, error: pageViewsError }] = await Promise.all([
  useFetch<{ data: MyDashboard }>('/api/me/dashboard'),
  useFetch<{ data: MyPageViews }>('/api/me/page-views'),
])
const dashboard = computed(() => dashboardResponse.value?.data ?? null)
const pageViews = computed(() => pageViewsResponse.value?.data ?? null)

const articleCountItems = [
  { key: 'published', label: '公開中' },
  { key: 'scheduled', label: '予約公開' },
  { key: 'draft', label: '下書き' },
  { key: 'pending', label: '承認待ち' },
  { key: 'unpublished', label: '非公開' },
] as const

const galleryCountItems = [
  { key: 'published', label: '公開中' },
  { key: 'draft', label: '下書き' },
  { key: 'pending', label: '承認待ち' },
] as const

useSeoMeta({ title: 'ダッシュボード', robots: 'noindex' })
</script>

<template>
  <div class="mypage-page">
    <div class="mb-4 d-flex align-items-center justify-content-between">
      <h1 class="h5 mb-0">ダッシュボード</h1>
    </div>

    <div v-if="dashboardError" class="alert alert-danger" role="alert">ダッシュボードを取得できませんでした。</div>

    <template v-if="dashboard">
      <div class="row g-3 mb-4">
        <div class="col-lg-7">
          <MypageDashboardCountCard label="記事" to="/mypage/articles" :counts="dashboard.counts.articles" :items="articleCountItems" />
        </div>
        <div class="col-lg-5">
          <MypageDashboardCountCard label="ギャラリー" to="/mypage/gallery" :counts="dashboard.counts.gallery_images" :items="galleryCountItems" />
        </div>
      </div>

      <div class="row g-3 mb-4">
        <div class="col-lg-8">
          <MypageDashboardRecentContents :contents="dashboard.recent_contents" />
        </div>
        <div class="col-lg-4">
          <MypageDashboardQuickActions :profile-path="dashboard.account.profile_path" />
        </div>
      </div>

      <div class="row g-3 mb-4">
        <div class="col-lg-6">
          <MypageDashboardScheduled :scheduled="dashboard.scheduled" />
        </div>
        <div class="col-lg-6">
          <MypageDashboardWarnings :warnings="dashboard.warnings" />
        </div>
      </div>

      <MypageDashboardActivities :activities="dashboard.recent_activities" />

      <div class="row g-3 mb-4">
        <div class="col-lg-6">
          <MypageDashboardAccount :account="dashboard.account" />
        </div>
        <div class="col-lg-6">
          <MypageDashboardMedia :media="dashboard.media" />
        </div>
      </div>
    </template>

    <div v-if="pageViewsError" class="alert alert-danger" role="alert">記事のアクセスを取得できませんでした。</div>

    <MypageDashboardPageViews v-if="pageViews" :page-views="pageViews" />
  </div>
</template>
