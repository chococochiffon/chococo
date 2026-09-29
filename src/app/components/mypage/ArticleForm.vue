<script setup lang="ts">
import type { Article, ArticlePathOption, MyArticle } from '~/types/api'

// マイページの記事の作成・編集フォーム(投稿先・タイトル・スラッグ・本文・サムネイル画像・タグ)とプレビュー。
// 保存すると、本文などの保存 → サムネイル画像の保存 → (申請するときは)承認の申請 の順に biscuit へ送り、保存後の記事を saved で返す。
// 公開中の記事は保存すると biscuit が承認待ちに戻す(管理者が承認するまで公開側に出ない)
const props = defineProps<{
  // 編集する記事(新規作成なら null)
  article: MyArticle | null
}>()

const emit = defineEmits<{
  saved: [article: MyArticle, message: string]
}>()

const { me } = useMe()
const { data: pathOptions } = await useFetch('/api/me/article-paths', {
  key: 'my-article-paths',
  transform: (response: { data: ArticlePathOption[] }) => response.data,
})

// 投稿先の選択肢の値。「今のまま」(投稿先が削除された・投稿先にない親パスの記事)は KEEP_PATH で、投稿先を送らない
const KEEP_PATH = 0

const form = reactive({
  title: props.article?.title ?? '',
  content: props.article?.content ?? '',
  pathOptionId: initialPathOptionId(),
  slug: props.article?.slug ?? '',
  tags: (props.article?.tags ?? []).map(tag => tag.name),
})
const thumbnail = ref<File | null>(null)
const thumbnailPreview = ref<string | null>(null)
const thumbnailInput = ref<HTMLInputElement>()
// 申請(approval)の入力エラー(下書きでないなど)は項目の欄がないため、フォームの上にまとめて出す
const { errors, submitting: saving, submit } = useFormSubmit({ generalErrorFields: ['approval'] })
const previewing = ref(false)

// 今の親パスが投稿先にあればその投稿先、なければ「今のまま」(新規作成なら最初の投稿先)
function initialPathOptionId(): number {
  if (props.article) {
    return pathOptions.value?.find(option => option.parent_path === props.article!.parent_path)?.id ?? KEEP_PATH
  }

  return pathOptions.value?.[0]?.id ?? KEEP_PATH
}

const keepsCurrentPath = computed(() => props.article !== null && !pathOptions.value?.some(option => option.parent_path === props.article!.parent_path))

// 保存後の URL の見込み(スラッグが未入力なら記事番号)
const previewPath = computed(() => {
  const parentPath = form.pathOptionId === KEEP_PATH
    ? props.article?.parent_path
    : pathOptions.value?.find(option => option.id === form.pathOptionId)?.parent_path
  const slug = form.slug.trim() || (props.article ? String(props.article.id) : '(記事番号)')

  return `/${[parentPath, slug].filter(Boolean).join('/')}`
})

const approval = computed(() => props.article?.approval ?? 'draft')

function selectThumbnail(event: Event) {
  setThumbnail((event.target as HTMLInputElement).files?.[0] ?? null)
}

// 選んだサムネイル画像(保存するまでは手元でプレビューする)
function setThumbnail(file: File | null) {
  if (thumbnailPreview.value) {
    URL.revokeObjectURL(thumbnailPreview.value)
  }

  thumbnail.value = file
  thumbnailPreview.value = file ? URL.createObjectURL(file) : null
}

onBeforeUnmount(() => {
  if (thumbnailPreview.value) {
    URL.revokeObjectURL(thumbnailPreview.value)
  }
})

// プレビューに渡す記事(公開側の記事の本文と同じ部品で表示する)
const previewArticle = computed<Article>(() => ({
  id: props.article?.id ?? 0,
  title: form.title || '(タイトル未入力)',
  parent_path: null,
  slug: null,
  path: previewPath.value,
  content: form.content,
  thumbnail_url: thumbnailPreview.value ?? props.article?.thumbnail_url ?? null,
  // 公開側と同じく、名前の表示設定に従った名前(非表示なら「投稿者」)
  author_name: (me.value?.detail ? userDisplayName(me.value.detail) : null) ?? '投稿者',
  tags: form.tags.map((name, index) => ({ id: index, name })),
  published_at: props.article?.first_published_at ?? new Date().toISOString(),
  updated_at: null,
}))

async function save(submitAfterSave: boolean) {
  if (approval.value === 'published' && !window.confirm('公開中の記事を保存すると承認待ちに戻り、管理者が承認するまで公開されなくなります。保存しますか?')) {
    return
  }

  await submit(async () => {
    const body = {
      title: form.title,
      content: form.content,
      slug: form.slug,
      tags: form.tags,
      article_path_option_id: form.pathOptionId === KEEP_PATH ? null : form.pathOptionId,
    }
    let article = props.article
      ? (await $fetch<{ data: MyArticle }>(`/api/me/articles/${props.article.id}`, { method: 'PUT', body })).data
      : (await $fetch<{ data: MyArticle }>('/api/me/articles', { method: 'POST', body })).data

    if (thumbnail.value) {
      const thumbnailBody = new FormData()
      thumbnailBody.append('thumbnail', thumbnail.value)
      article = (await $fetch<{ data: MyArticle }>(`/api/me/articles/${article.id}/thumbnail`, { method: 'POST', body: thumbnailBody })).data
      setThumbnail(null)
      thumbnailInput.value!.value = ''
    }

    if (submitAfterSave && article.approval === 'draft') {
      article = (await $fetch<{ data: MyArticle }>(`/api/me/articles/${article.id}/submit`, { method: 'POST' })).data
    }

    emit('saved', article, savedMessage(article))
  })
}

// 本文の画像のアップロードに失敗したときは、フォームの上にまとめて出す
function showUploadError(message: string) {
  errors.value = { ...errors.value, _: message }
}

function savedMessage(article: MyArticle): string {
  if (article.approval === 'pending') {
    return approval.value === 'published'
      ? '記事を保存しました。管理者が承認するまで、公開側には表示されません。'
      : '記事を保存し、承認を申請しました。'
  }

  return '記事を下書きに保存しました。'
}
</script>

<template>
  <div>
    <div class="d-flex justify-content-end mb-3">
      <div class="btn-group btn-group-sm" role="group" aria-label="表示の切り替え">
        <button type="button" class="btn" :class="previewing ? 'btn-outline-secondary' : 'btn-secondary'" @click="previewing = false">編集</button>
        <button type="button" class="btn" :class="previewing ? 'btn-secondary' : 'btn-outline-secondary'" @click="previewing = true">プレビュー</button>
      </div>
    </div>

    <div v-if="previewing" class="card">
      <PageArticleBody :article="previewArticle" />
    </div>

    <!-- 管理画面の記事フォームと同じく、左: タイトル・本文・送信ボタン / 右: それ以外の設定項目 -->
    <form v-show="!previewing" novalidate @submit.prevent="save(false)">
      <div v-if="errors._" class="alert alert-danger small" role="alert">{{ errors._ }}</div>

      <div class="row g-4">
        <div class="col-lg-8">
          <div class="card card-body p-4">
            <div class="mb-3">
              <label for="my-article-title" class="form-label">タイトル</label>
              <input id="my-article-title" v-model="form.title" type="text" class="form-control" :class="{ 'is-invalid': errors.title }" maxlength="255" required>
              <div class="invalid-feedback">{{ errors.title }}</div>
            </div>

            <div class="mb-3">
              <div class="form-label is-required">本文</div>
              <MypageRichEditor v-model="form.content" :invalid="!!errors.content" @upload-error="showUploadError" />
              <div v-if="errors.content" class="invalid-feedback d-block">{{ errors.content }}</div>
            </div>

            <div class="d-flex flex-wrap align-items-center gap-2">
              <template v-if="approval === 'draft'">
                <button type="submit" class="btn btn-outline-primary" :disabled="saving">下書き保存</button>
                <button type="button" class="btn btn-primary" :disabled="saving" @click="save(true)">保存して承認を申請</button>
              </template>
              <button v-else-if="approval === 'pending'" type="submit" class="btn btn-primary" :disabled="saving">保存する</button>
              <button v-else type="submit" class="btn btn-primary" :disabled="saving">保存して承認を申請し直す</button>
              <NuxtLink to="/mypage/articles" class="text-secondary ms-2">キャンセル</NuxtLink>
            </div>
          </div>
        </div>

        <div class="col-lg-4">
          <div class="card card-body p-4">
            <div class="mb-3">
              <label for="my-article-path" class="form-label is-required">投稿先</label>
              <select id="my-article-path" v-model.number="form.pathOptionId" class="form-select" :class="{ 'is-invalid': errors.article_path_option_id }">
                <option v-if="keepsCurrentPath" :value="KEEP_PATH">今のまま(/{{ article?.parent_path }}/)</option>
                <option v-for="option in pathOptions ?? []" :key="option.id" :value="option.id">{{ option.label }}(/{{ option.parent_path }}/)</option>
              </select>
              <div class="invalid-feedback">{{ errors.article_path_option_id }}</div>
              <div v-if="!keepsCurrentPath && !pathOptions?.length" class="form-text text-danger">投稿先が登録されていません。管理者にお問い合わせください。</div>
            </div>

            <div class="mb-3">
              <label for="my-article-slug" class="form-label">スラッグ</label>
              <input id="my-article-slug" v-model="form.slug" type="text" class="form-control" :class="{ 'is-invalid': errors.slug }" placeholder="例: my-first-post" autocomplete="off">
              <div class="invalid-feedback">{{ errors.slug }}</div>
              <div class="form-text">半角英小文字・数字・ハイフン。未入力なら記事番号。<br>URL: <code>{{ previewPath }}</code></div>
            </div>

            <div class="mb-3">
              <label for="my-article-thumbnail" class="form-label">サムネイル画像</label>
              <img v-if="thumbnailPreview || article?.thumbnail_url" :src="thumbnailPreview ?? article?.thumbnail_url ?? ''" alt="" class="img-fluid rounded border d-block mb-2">
              <input id="my-article-thumbnail" ref="thumbnailInput" type="file" accept="image/*" class="form-control form-control-sm" :class="{ 'is-invalid': errors.thumbnail }" @change="selectThumbnail">
              <div class="invalid-feedback">{{ errors.thumbnail }}</div>
              <div class="form-text">1200×630px または 1280×720px のうち、比率が近い方へ中央を切り抜いて縮小します。</div>
            </div>

            <div>
              <label for="my-article-tags" class="form-label">タグ</label>
              <MypageTagInput v-model="form.tags" />
            </div>
          </div>
        </div>
      </div>
    </form>
  </div>
</template>
