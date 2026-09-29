<script setup lang="ts">
import type { ArticleApproval, MyArticle, Paginated } from '~/types/api'

// マイページ: 自分の記事の一覧(公開ステータスで絞り込み、更新日時の新しい順)
definePageMeta({ middleware: 'auth', layout: 'mypage' })

const route = useRoute()
// 作成・削除のあとに、元のページから渡されたメッセージ
const flash = useState<string>('my-articles-flash', () => '')
const status = ref(flash.value)
flash.value = ''

const filters: { value: ArticleApproval | undefined, label: string }[] = [
  { value: undefined, label: 'すべて' },
  { value: 'draft', label: '下書き' },
  { value: 'pending', label: '承認待ち' },
  { value: 'published', label: '公開中' },
]

const approval = computed(() => filters.find(filter => filter.value === route.query.approval)?.value)
const { data: articles, error } = await useFetch<Paginated<MyArticle>>('/api/me/articles', {
  query: computed(() => ({ approval: approval.value, page: route.query.page })),
})

useSeoMeta({ title: '記事の管理', robots: 'noindex' })
</script>

<template>
  <div>
    <div class="mb-4 d-flex align-items-center justify-content-between">
      <h1 class="h5 mb-0">記事の管理</h1>
      <NuxtLink to="/mypage/articles/new" class="btn btn-primary">新規作成</NuxtLink>
    </div>

    <div v-if="status" class="alert alert-success" role="status">{{ status }}</div>
    <div v-if="error" class="alert alert-danger" role="alert">記事の一覧を取得できませんでした。</div>

    <div class="card card-body mb-3 py-2">
      <ul class="nav nav-pills small" aria-label="ステータスで絞り込み">
        <li v-for="filter in filters" :key="filter.label" class="nav-item">
          <NuxtLink class="nav-link py-1" :class="{ active: filter.value === approval }" :to="{ query: { approval: filter.value } }">{{ filter.label }}</NuxtLink>
        </li>
      </ul>
    </div>

    <div class="card">
      <div class="table-responsive">
        <table class="table table-hover align-middle">
          <thead>
            <tr class="text-nowrap">
              <th>サムネイル</th>
              <th>タイトル</th>
              <th>URL</th>
              <th>ステータス</th>
              <th>更新日時</th>
              <th />
            </tr>
          </thead>
          <tbody>
            <tr v-for="article in articles?.data ?? []" :key="article.id">
              <td>
                <img :src="article.thumbnail_url ?? ''" alt="" class="img-thumbnail object-fit-cover" style="width: 112px; height: 63px;">
              </td>
              <td>
                {{ article.title }}
                <div v-if="article.review_comment" class="small text-danger mt-1">
                  <i class="bi bi-exclamation-circle me-1" />差し戻し: {{ article.review_comment }}
                </div>
              </td>
              <td><code>{{ article.path }}</code></td>
              <td class="text-nowrap"><MypageApprovalBadge :approval="article.approval" /></td>
              <td class="text-nowrap">{{ formatDateTime(article.updated_at) }}</td>
              <td class="text-end text-nowrap">
                <NuxtLink v-if="article.approval === 'published'" :to="article.path" class="btn btn-sm btn-outline-secondary me-1">表示</NuxtLink>
                <NuxtLink :to="`/mypage/articles/${article.id}`" class="btn btn-sm btn-outline-secondary">編集</NuxtLink>
              </td>
            </tr>
            <tr v-if="articles && articles.data.length === 0">
              <td colspan="6" class="text-center text-body-secondary py-4">該当する記事がありません。</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <div class="mt-3">
      <AppPagination v-if="articles" :current-page="articles.meta.current_page" :last-page="articles.meta.last_page" />
    </div>
  </div>
</template>
