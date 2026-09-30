<script setup lang="ts">
import type { MyDashboard } from '~/types/api'

// ダッシュボードの「コンテンツチェック」(差し戻し・リンク切れ・サムネイル未設定・承認待ち。該当があるものだけ届く)
const props = defineProps<{
  warnings: MyDashboard['warnings']
}>()

const labels: Record<MyDashboard['warnings'][number]['key'], string> = {
  returned: '差し戻された記事・画像',
  broken_links: 'リンク切れのある記事',
  no_thumbnail: '公開中・予約公開なのにサムネイル未設定の記事',
  pending: '承認待ちの記事・画像',
}

const isLast = (index: number) => index === props.warnings.length - 1
</script>

<template>
  <div class="card h-100">
    <div class="card-header bg-transparent fw-semibold">コンテンツチェック</div>
    <div class="card-body">
      <div v-for="(warning, index) in warnings" :key="warning.key" :class="{ 'mb-3': !isLast(index) }">
        <div class="d-flex align-items-center gap-2">
          <!-- 承認待ちは対応を待つだけなので、ほかの注意事項より控えめに出す -->
          <i class="bi" :class="warning.key === 'pending' ? 'bi-hourglass-split text-body-secondary' : 'bi-exclamation-triangle-fill text-warning'" />
          <span>{{ labels[warning.key] }}</span>
          <span class="badge rounded-pill" :class="warning.key === 'pending' ? 'text-bg-secondary' : 'text-bg-warning'">{{ warning.count.toLocaleString() }}件</span>
        </div>
        <ul v-if="warning.items.length > 0" class="small mb-0 mt-1 ps-4">
          <li v-for="item in warning.items" :key="`${item.type}-${item.id}`">
            <NuxtLink :to="myContentEditPath(item)">{{ item.title }}</NuxtLink>
            <span class="text-body-secondary ms-1">({{ myContentTypeLabels[item.type] }})</span>
            <div v-if="item.links" class="text-body-secondary text-break">
              <template v-for="(link, linkIndex) in item.links" :key="link"><code>{{ link }}</code><template v-if="linkIndex < item.links.length - 1">, </template></template>
            </div>
          </li>
          <li v-if="warning.count > warning.items.length" class="list-unstyled text-body-secondary">ほか {{ (warning.count - warning.items.length).toLocaleString() }}件</li>
        </ul>
      </div>
      <div v-if="warnings.length === 0" class="small text-body-secondary">
        <i class="bi bi-check-circle text-success me-1" />気になる点はありません。
      </div>
    </div>
  </div>
</template>
