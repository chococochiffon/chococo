<script setup lang="ts">
import type { ArticleApproval, MyArticle, Paginated } from '~/types/api'

// マイページ: 自分の記事の一覧(公開ステータスで絞り込み、更新日時の新しい順)
definePageMeta({ middleware: 'auth' })

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
  <LayoutSidebarFrame
    page-type="other"
    :breadcrumbs="[{ label: 'Home', path: '/' }, { label: 'マイページ', path: '/mypage' }, { label: '記事の管理', path: '/mypage/articles' }]"
  >
    <div class="container">
      <div class="row py-5 justify-content-center">
        <div class="col-lg-10">
          <SectionHeading title="My Articles" subtitle="記事の管理" />

          <div v-if="status" class="alert alert-success small" role="status">{{ status }}</div>
          <div v-if="error" class="alert alert-danger small" role="alert">記事の一覧を取得できませんでした。</div>

          <div class="d-flex flex-wrap align-items-center justify-content-between gap-2 mb-3">
            <ul class="nav nav-pills small">
              <li v-for="filter in filters" :key="filter.label" class="nav-item">
                <NuxtLink class="nav-link py-1" :class="{ active: filter.value === approval }" :to="{ query: { approval: filter.value } }">{{ filter.label }}</NuxtLink>
              </li>
            </ul>
            <NuxtLink to="/mypage/articles/new" class="btn btn-primary btn-sm"><i class="bi bi-plus-lg me-1" />新しい記事を書く</NuxtLink>
          </div>

          <div class="card shadow-sm">
            <ul class="list-group list-group-flush">
              <li v-for="article in articles?.data ?? []" :key="article.id" class="list-group-item d-flex flex-wrap align-items-center gap-3 py-3">
                <img :src="article.thumbnail_url ?? ''" alt="" class="rounded border object-fit-cover" width="96" height="54">
                <div class="flex-grow-1" style="min-width: 12rem;">
                  <div class="d-flex align-items-center gap-2">
                    <MypageApprovalBadge :approval="article.approval" />
                    <NuxtLink :to="`/mypage/articles/${article.id}`" class="fw-bold text-decoration-none">{{ article.title }}</NuxtLink>
                  </div>
                  <div class="small text-body-secondary mt-1">
                    <code>{{ article.path }}</code>
                    <span class="ms-2">更新: {{ formatDate(article.updated_at) }}</span>
                  </div>
                  <div v-if="article.review_comment" class="small text-danger mt-1">
                    <i class="bi bi-exclamation-circle me-1" />差し戻されました: {{ article.review_comment }}
                  </div>
                </div>
                <div class="d-flex gap-2">
                  <NuxtLink v-if="article.approval === 'published'" :to="article.path" class="btn btn-outline-secondary btn-sm">表示</NuxtLink>
                  <NuxtLink :to="`/mypage/articles/${article.id}`" class="btn btn-outline-primary btn-sm">編集</NuxtLink>
                </div>
              </li>
              <li v-if="articles && articles.data.length === 0" class="list-group-item text-center text-body-secondary py-5">
                記事がありません。
              </li>
            </ul>
          </div>

          <div class="mt-4">
            <AppPagination v-if="articles" :current-page="articles.meta.current_page" :last-page="articles.meta.last_page" />
          </div>
        </div>
      </div>
    </div>
  </LayoutSidebarFrame>
</template>
