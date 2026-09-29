<script setup lang="ts">
import type { MyArticle } from '~/types/api'

// マイページ: 記事の新規作成(下書きで作り、そのまま承認を申請することもできる)
definePageMeta({ middleware: 'auth' })

const flash = useState<string>('my-articles-flash', () => '')

async function onSaved(_article: MyArticle, message: string) {
  flash.value = message
  await navigateTo('/mypage/articles')
}

useSeoMeta({ title: '記事の作成', robots: 'noindex' })
</script>

<template>
  <LayoutSidebarFrame
    page-type="other"
    :breadcrumbs="[
      { label: 'Home', path: '/' },
      { label: 'マイページ', path: '/mypage' },
      { label: '記事の管理', path: '/mypage/articles' },
      { label: '記事の作成', path: '/mypage/articles/new' },
    ]"
  >
    <div class="container">
      <div class="row py-5 justify-content-center">
        <div class="col-lg-10">
          <SectionHeading title="New Article" subtitle="記事の作成" />
          <p class="small text-body-secondary">
            記事は下書きで保存され、承認を申請して管理者が承認すると公開されます。
          </p>
          <MypageArticleForm :article="null" @saved="onSaved" />
        </div>
      </div>
    </div>
  </LayoutSidebarFrame>
</template>
