<script setup lang="ts">
import type { MyDashboard, MyPageViews } from '~/types/api'

// マイページのダッシュボード(ログイン後の既定の画面)。管理画面のダッシュボードの項目を自分の分に絞って表示する:
// 記事・ギャラリーの状況、最近編集したもの、クイック操作、公開予定、コンテンツチェック、最近の操作、アカウント、画像と、
// 自分の記事のアクセス(今日・昨日・今月・累計の PV と UU、直近 30 日の推移、直近 30 日の人気記事)。サイト全体の数字は出さない
definePageMeta({ middleware: 'auth', layout: 'mypage' })

const [{ data: dashboardResponse, error: dashboardError }, { data: response, error }] = await Promise.all([
  useFetch<{ data: MyDashboard }>('/api/me/dashboard'),
  useFetch<{ data: MyPageViews }>('/api/me/page-views'),
])
const dashboard = computed(() => dashboardResponse.value?.data ?? null)
const pageViews = computed(() => response.value?.data ?? null)

const summaryCards = [
  { key: 'today', label: '今日' },
  { key: 'yesterday', label: '昨日' },
  { key: 'this_month', label: '今月' },
  { key: 'total', label: '累計' },
] as const

const articleCounts = [
  { key: 'published', label: '公開中' },
  { key: 'scheduled', label: '予約公開' },
  { key: 'draft', label: '下書き' },
  { key: 'pending', label: '承認待ち' },
  { key: 'unpublished', label: '非公開' },
] as const

const galleryCounts = [
  { key: 'published', label: '公開中' },
  { key: 'draft', label: '下書き' },
  { key: 'pending', label: '承認待ち' },
] as const

const quickActions = [
  { to: '/mypage/articles/new', icon: 'bi-pencil-square', label: '記事を書く' },
  { to: '/mypage/gallery/new', icon: 'bi-image', label: 'ギャラリーに投稿' },
  { to: '/mypage/profile', icon: 'bi-person-gear', label: 'プロフィールを編集' },
] as const

const warningLabels: Record<MyDashboard['warnings'][number]['key'], string> = {
  returned: '差し戻された記事・画像',
  broken_links: 'リンク切れのある記事',
  no_thumbnail: '公開中・予約公開なのにサムネイル未設定の記事',
  pending: '承認待ちの記事・画像',
}

const mediaLabels: Record<MyDashboard['media']['groups'][number]['key'], string> = {
  thumbnail: '記事のサムネイル',
  gallery: 'ギャラリー',
  icon: 'アイコン',
}

const typeLabels = { article: '記事', gallery_image: 'ギャラリー' } as const

function editPath(item: { type: 'article' | 'gallery_image', id: number }): string {
  return item.type === 'article' ? `/mypage/articles/${item.id}` : `/mypage/gallery/${item.id}`
}

// 公開予定の時刻(今日は時刻だけ、今週は月日と時刻)
function formatScheduled(iso: string, withDate: boolean): string {
  return new Date(iso).toLocaleString('ja-JP', {
    timeZone: 'Asia/Tokyo',
    ...(withDate ? { month: '2-digit', day: '2-digit' } : {}),
    hour: '2-digit',
    minute: '2-digit',
  })
}

useSeoMeta({ title: 'ダッシュボード', robots: 'noindex' })
</script>

<template>
  <div class="mypage-page">
    <div class="mb-4 d-flex align-items-center justify-content-between">
      <h1 class="h5 mb-0">ダッシュボード</h1>
    </div>

    <div v-if="dashboardError" class="alert alert-danger" role="alert">ダッシュボードを取得できませんでした。</div>

    <template v-if="dashboard">
      <!-- 記事・ギャラリーの状況 -->
      <div class="row g-3 mb-4">
        <div class="col-lg-7">
          <div class="card h-100">
            <div class="card-body d-flex flex-wrap align-items-center gap-4">
              <NuxtLink to="/mypage/articles" class="text-decoration-none text-reset">
                <div class="small text-body-secondary">記事</div>
                <div class="fs-3 fw-semibold">{{ dashboard.counts.articles.total.toLocaleString() }}</div>
              </NuxtLink>
              <dl class="d-flex flex-wrap gap-4 mb-0">
                <div v-for="count in articleCounts" :key="count.key">
                  <dt class="small text-body-secondary fw-normal">{{ count.label }}</dt>
                  <dd class="fs-5 mb-0">{{ dashboard.counts.articles[count.key].toLocaleString() }}</dd>
                </div>
              </dl>
            </div>
          </div>
        </div>
        <div class="col-lg-5">
          <div class="card h-100">
            <div class="card-body d-flex flex-wrap align-items-center gap-4">
              <NuxtLink to="/mypage/gallery" class="text-decoration-none text-reset">
                <div class="small text-body-secondary">ギャラリー</div>
                <div class="fs-3 fw-semibold">{{ dashboard.counts.gallery_images.total.toLocaleString() }}</div>
              </NuxtLink>
              <dl class="d-flex flex-wrap gap-4 mb-0">
                <div v-for="count in galleryCounts" :key="count.key">
                  <dt class="small text-body-secondary fw-normal">{{ count.label }}</dt>
                  <dd class="fs-5 mb-0">{{ dashboard.counts.gallery_images[count.key].toLocaleString() }}</dd>
                </div>
              </dl>
            </div>
          </div>
        </div>
      </div>

      <div class="row g-3 mb-4">
        <!-- 最近編集したもの -->
        <div class="col-lg-8">
          <div class="card h-100">
            <div class="card-header bg-transparent fw-semibold">最近編集したもの</div>
            <div class="table-responsive">
              <table class="table table-hover align-middle mb-0">
                <thead>
                  <tr class="small text-nowrap">
                    <th>タイトル</th>
                    <th>状態</th>
                    <th>更新日時</th>
                    <th />
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="item in dashboard.recent_contents" :key="`${item.type}-${item.id}`">
                    <td>
                      <div class="small text-body-secondary">{{ typeLabels[item.type] }}</div>
                      {{ item.title }}
                    </td>
                    <td><MypageApprovalBadge :approval="item.status" /></td>
                    <td class="small text-nowrap">{{ formatDateTime(item.updated_at) }}</td>
                    <td class="text-end">
                      <NuxtLink :to="editPath(item)" class="btn btn-sm btn-outline-secondary text-nowrap">編集</NuxtLink>
                    </td>
                  </tr>
                  <tr v-if="dashboard.recent_contents.length === 0">
                    <td colspan="4" class="text-center text-body-secondary py-4">まだ記事・画像がありません。</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <!-- クイック操作 -->
        <div class="col-lg-4">
          <div class="card h-100">
            <div class="card-header bg-transparent fw-semibold">クイック操作</div>
            <div class="list-group list-group-flush">
              <NuxtLink v-for="action in quickActions" :key="action.to" :to="action.to" class="list-group-item list-group-item-action d-flex align-items-center gap-2">
                <i class="bi text-primary" :class="action.icon" />{{ action.label }}
              </NuxtLink>
              <NuxtLink v-if="dashboard.account.profile_path" :to="dashboard.account.profile_path" class="list-group-item list-group-item-action d-flex align-items-center gap-2">
                <i class="bi bi-box-arrow-up-right text-primary" />投稿者ページを見る
              </NuxtLink>
            </div>
          </div>
        </div>
      </div>

      <div class="row g-3 mb-4">
        <!-- 公開予定 -->
        <div class="col-lg-6">
          <div class="card h-100">
            <div class="card-header bg-transparent fw-semibold">公開予定</div>
            <div class="card-body">
              <div v-for="(group, index) in [{ key: 'today', label: '今日公開' }, { key: 'this_week', label: '今週公開予定(7日以内)' }] as const" :key="group.key" :class="{ 'mb-3': index === 0 }">
                <div class="small text-body-secondary mb-1">{{ group.label }}</div>
                <div v-for="article in dashboard.scheduled[group.key]" :key="article.id" class="d-flex align-items-baseline gap-2 py-1">
                  <span class="small text-nowrap text-body-secondary">{{ formatScheduled(article.publish_at, group.key === 'this_week') }}</span>
                  <NuxtLink :to="`/mypage/articles/${article.id}`" class="text-truncate">{{ article.title }}</NuxtLink>
                </div>
                <div v-if="dashboard.scheduled[group.key].length === 0" class="small text-body-secondary">予定はありません。</div>
              </div>
            </div>
          </div>
        </div>

        <!-- コンテンツチェック -->
        <div class="col-lg-6">
          <div class="card h-100">
            <div class="card-header bg-transparent fw-semibold">コンテンツチェック</div>
            <div class="card-body">
              <div v-for="(warning, index) in dashboard.warnings" :key="warning.key" :class="{ 'mb-3': index < dashboard.warnings.length - 1 }">
                <div class="d-flex align-items-center gap-2">
                  <i class="bi" :class="warning.key === 'pending' ? 'bi-hourglass-split text-body-secondary' : 'bi-exclamation-triangle-fill text-warning'" />
                  <span>{{ warningLabels[warning.key] }}</span>
                  <span class="badge rounded-pill" :class="warning.key === 'pending' ? 'text-bg-secondary' : 'text-bg-warning'">{{ warning.count.toLocaleString() }}件</span>
                </div>
                <ul v-if="warning.items.length > 0" class="small mb-0 mt-1 ps-4">
                  <li v-for="item in warning.items" :key="`${item.type}-${item.id}`">
                    <NuxtLink :to="editPath(item)">{{ item.title }}</NuxtLink>
                    <span class="text-body-secondary ms-1">({{ typeLabels[item.type] }})</span>
                    <div v-if="item.links" class="text-body-secondary text-break">
                      <template v-for="(link, linkIndex) in item.links" :key="link"><code>{{ link }}</code><template v-if="linkIndex < item.links.length - 1">, </template></template>
                    </div>
                  </li>
                  <li v-if="warning.count > warning.items.length" class="list-unstyled text-body-secondary">ほか {{ (warning.count - warning.items.length).toLocaleString() }}件</li>
                </ul>
              </div>
              <div v-if="dashboard.warnings.length === 0" class="small text-body-secondary">
                <i class="bi bi-check-circle text-success me-1" />気になる点はありません。
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 最近の操作 -->
      <div class="card mb-4">
        <div class="card-header bg-transparent fw-semibold">最近の操作</div>
        <ul class="list-group list-group-flush">
          <li v-for="(activity, index) in dashboard.recent_activities" :key="index" class="list-group-item d-flex flex-wrap align-items-center gap-2">
            <span class="small text-body-secondary text-nowrap">{{ formatDateTime(activity.created_at) }}</span>
            <span class="badge text-bg-light border">{{ activity.action_label }}</span>
            <span>
              <span v-if="activity.subject_type_label" class="text-body-secondary">{{ activity.subject_type_label }}</span>
              {{ activity.subject_label }}
            </span>
          </li>
          <li v-if="dashboard.recent_activities.length === 0" class="list-group-item small text-body-secondary">操作の記録はまだありません。</li>
        </ul>
      </div>

      <div class="row g-3 mb-4">
        <!-- アカウント -->
        <div class="col-lg-6">
          <div class="card h-100">
            <div class="card-header bg-transparent fw-semibold">アカウント</div>
            <div class="card-body">
              <dl class="row small mb-0">
                <dt class="col-5 fw-normal text-body-secondary">公開のしかた</dt>
                <dd class="col-7">{{ dashboard.account.skip_approval ? '承認なしで公開' : '管理者の承認後に公開' }}</dd>
                <dt class="col-5 fw-normal text-body-secondary">投稿者ページ</dt>
                <dd class="col-7">
                  <NuxtLink v-if="dashboard.account.profile_path" :to="dashboard.account.profile_path">公開中</NuxtLink>
                  <template v-else>非公開(<NuxtLink to="/mypage/profile">プロフィール</NuxtLink>で変更できます)</template>
                </dd>
                <dt class="col-5 fw-normal text-body-secondary">最近のログイン</dt>
                <dd class="col-7 mb-0">
                  <div v-for="login in dashboard.account.recent_logins" :key="login">{{ formatDateTime(login) }}</div>
                  <span v-if="dashboard.account.recent_logins.length === 0" class="text-body-secondary">記録はありません。</span>
                </dd>
              </dl>
            </div>
          </div>
        </div>

        <!-- 画像 -->
        <div class="col-lg-6">
          <div class="card h-100">
            <div class="card-header bg-transparent fw-semibold">画像</div>
            <div class="card-body">
              <div class="d-flex flex-wrap gap-4 mb-3">
                <div>
                  <div class="small text-body-secondary">画像</div>
                  <div class="fs-4 fw-semibold">{{ dashboard.media.count.toLocaleString() }}</div>
                </div>
                <div>
                  <div class="small text-body-secondary">使用容量</div>
                  <div class="fs-4 fw-semibold">{{ formatFileSize(dashboard.media.bytes) }}</div>
                </div>
              </div>
              <table class="table table-sm small mb-0">
                <tbody>
                  <tr v-for="group in dashboard.media.groups" :key="group.key">
                    <td class="text-body-secondary">{{ mediaLabels[group.key] }}</td>
                    <td class="text-end">{{ group.count.toLocaleString() }}件</td>
                    <td class="text-end text-nowrap">{{ formatFileSize(group.bytes) }}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </template>

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
