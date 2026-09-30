<script setup lang="ts">
import type { MyPageViews } from '~/types/api'

// マイページのダッシュボード(ログイン後の既定の画面)。自分の記事のアクセス(今日・昨日・今月・累計の PV と UU、
// 直近 30 日の推移、直近 30 日の人気記事)を表示する。サイト全体の数字は出さない
definePageMeta({ middleware: 'auth', layout: 'mypage' })

const { data: response, error } = await useFetch<{ data: MyPageViews }>('/api/me/page-views')
const pageViews = computed(() => response.value?.data ?? null)

const summaryCards = [
  { key: 'today', label: '今日' },
  { key: 'yesterday', label: '昨日' },
  { key: 'this_month', label: '今月' },
  { key: 'total', label: '累計' },
] as const

useSeoMeta({ title: 'ダッシュボード', robots: 'noindex' })
</script>

<template>
  <div class="mypage-page">
    <div class="mb-4 d-flex align-items-center justify-content-between">
      <h1 class="h5 mb-0">ダッシュボード</h1>
    </div>

    <div v-if="error" class="alert alert-danger" role="alert">記事のアクセスを取得できませんでした。</div>

    <template v-if="pageViews">
      <h2 class="h6 mb-3">記事のアクセス</h2>

      <div class="row g-3 mb-4">
        <div v-for="card in summaryCards" :key="card.key" class="col-6 col-lg-3">
          <div class="card h-100">
            <div class="card-body">
              <div class="small text-body-secondary mb-1">{{ card.label }}</div>
              <div class="fs-4 fw-semibold">
                {{ pageViews.summary[card.key].views.toLocaleString() }} <span class="fs-6 fw-normal text-body-secondary">PV</span>
              </div>
              <div class="small text-body-secondary">{{ pageViews.summary[card.key].unique_visitors.toLocaleString() }} UU</div>
            </div>
          </div>
        </div>
      </div>

      <h2 class="h6 mb-3">直近30日のアクセス推移</h2>

      <div class="card mb-4">
        <div class="card-body">
          <MypagePageViewChart :daily="pageViews.daily" label="直近30日の記事のアクセス推移(PV・UU)" />
        </div>
      </div>

      <h2 class="h6 mb-3">人気の記事(直近30日)</h2>

      <div class="card">
        <div class="table-responsive">
          <table class="table table-hover align-middle">
            <thead>
              <tr class="text-nowrap">
                <th class="text-end" style="width: 3rem;">#</th>
                <th>タイトル</th>
                <th class="text-end">PV</th>
                <th class="text-end">UU</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(article, index) in pageViews.ranking" :key="article.article_id">
                <td class="text-end text-body-secondary">{{ index + 1 }}</td>
                <td>
                  <NuxtLink :to="`/mypage/articles/${article.article_id}`">{{ article.title }}</NuxtLink>
                  <div class="small text-body-secondary"><code>{{ article.path }}</code></div>
                </td>
                <td class="text-end text-nowrap">{{ article.views.toLocaleString() }}</td>
                <td class="text-end text-nowrap">{{ article.unique_visitors.toLocaleString() }}</td>
              </tr>
              <tr v-if="pageViews.ranking.length === 0">
                <td colspan="4" class="text-center text-body-secondary py-4">直近30日のアクセスはまだありません。</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </template>
  </div>
</template>
