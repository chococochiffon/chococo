<script setup lang="ts">
import type { ArticleApproval, MyGalleryImage, Paginated } from '~/types/api'

// マイページ: 自分が投稿したギャラリーの画像の一覧(公開ステータスで絞り込み、更新日時の新しい順)
definePageMeta({ middleware: 'auth', layout: 'mypage' })

const route = useRoute()
// 投稿・削除のあとに、元のページから渡されたメッセージ
const flash = useState<string>('my-gallery-flash', () => '')
const status = ref(flash.value)
flash.value = ''

const filters: { value: ArticleApproval | undefined, label: string }[] = [
  { value: undefined, label: 'すべて' },
  { value: 'draft', label: '下書き' },
  { value: 'pending', label: '承認待ち' },
  { value: 'published', label: '公開中' },
]

const approval = computed(() => filters.find(filter => filter.value === route.query.approval)?.value)
const { data: galleryImages, error } = await useFetch<Paginated<MyGalleryImage>>('/api/me/gallery-images', {
  query: computed(() => ({ approval: approval.value, page: route.query.page })),
})

useSeoMeta({ title: 'ギャラリーの管理', robots: 'noindex' })
</script>

<template>
  <div>
    <div class="mb-4 d-flex align-items-center justify-content-between">
      <h1 class="h5 mb-0">ギャラリーの管理</h1>
      <NuxtLink to="/mypage/gallery/new" class="btn btn-primary">新規投稿</NuxtLink>
    </div>

    <div v-if="status" class="alert alert-success" role="status">{{ status }}</div>
    <div v-if="error" class="alert alert-danger" role="alert">画像の一覧を取得できませんでした。</div>

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
              <th>画像</th>
              <th>名前</th>
              <th>分類</th>
              <th>コメント</th>
              <th>ステータス</th>
              <th>更新日時</th>
              <th />
            </tr>
          </thead>
          <tbody>
            <tr v-for="galleryImage in galleryImages?.data ?? []" :key="galleryImage.id">
              <td>
                <img :src="galleryImage.image_url" alt="" class="img-thumbnail object-fit-cover" style="width: 64px; height: 64px;">
              </td>
              <td>
                {{ galleryImage.name }}
                <div v-if="galleryImage.review_comment" class="small text-danger mt-1">
                  <i class="bi bi-exclamation-circle me-1" />差し戻し: {{ galleryImage.review_comment }}
                </div>
              </td>
              <td class="text-nowrap">{{ galleryImage.category?.name ?? '未分類' }}</td>
              <td>{{ galleryImage.comment }}</td>
              <td class="text-nowrap"><MypageApprovalBadge :approval="galleryImage.approval" /></td>
              <td class="text-nowrap">{{ formatDateTime(galleryImage.updated_at) }}</td>
              <td class="text-end text-nowrap">
                <NuxtLink :to="`/mypage/gallery/${galleryImage.id}`" class="btn btn-sm btn-outline-secondary">編集</NuxtLink>
              </td>
            </tr>
            <tr v-if="galleryImages && galleryImages.data.length === 0">
              <td colspan="7" class="text-center text-body-secondary py-4">該当する画像がありません。</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <div class="mt-3">
      <AppPagination v-if="galleryImages" :current-page="galleryImages.meta.current_page" :last-page="galleryImages.meta.last_page" />
    </div>
  </div>
</template>
