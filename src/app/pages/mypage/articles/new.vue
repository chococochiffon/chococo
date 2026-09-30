<script setup lang="ts">
import type { MyArticle } from '~/types/api'

// マイページ: 記事の新規作成(下書きで作り、そのまま承認を申請することもできる)
definePageMeta({ middleware: 'auth', layout: 'mypage' })

const { me } = useMe()
const flash = useState<string>('my-articles-flash', () => '')

async function onSaved(_article: MyArticle, message: string) {
  flash.value = message
  await navigateTo('/mypage/articles')
}

useSeoMeta({ title: '記事の作成', robots: 'noindex' })
</script>

<template>
  <div class="mypage-page">
    <div class="mb-4 d-flex align-items-center justify-content-between">
      <h1 class="h5 mb-0">記事の作成</h1>
    </div>
    <p class="small text-body-secondary">
      <template v-if="me?.skip_approval">記事は下書きで保存され、「保存して公開」で公開されます。</template>
      <template v-else>記事は下書きで保存され、承認を申請して管理者が承認すると公開されます。</template>
    </p>
    <MypageArticleForm :article="null" @saved="onSaved" />
  </div>
</template>
