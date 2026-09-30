<script setup lang="ts">
import type { MyGalleryImage } from '~/types/api'

// マイページ: ギャラリーへの画像の投稿(下書きで作り、そのまま承認を申請することもできる)
definePageMeta({ middleware: 'auth', layout: 'mypage' })

const { me } = useMe()
const flash = useState<string>('my-gallery-flash', () => '')

async function onSaved(_galleryImage: MyGalleryImage, message: string) {
  flash.value = message
  await navigateTo('/mypage/gallery')
}

useSeoMeta({ title: 'ギャラリーへの投稿', robots: 'noindex' })
</script>

<template>
  <div class="mypage-page mypage-page-narrow">
    <div class="mb-4 d-flex align-items-center justify-content-between">
      <h1 class="h5 mb-0">ギャラリーへの投稿</h1>
    </div>
    <p class="small text-body-secondary">
      <template v-if="me?.skip_approval">画像は下書きで保存され、「保存して公開」で公開されます。</template>
      <template v-else>画像は下書きで保存され、承認を申請して管理者が承認すると公開されます。</template>
    </p>
    <MypageGalleryImageForm :gallery-image="null" @saved="onSaved" />
  </div>
</template>
