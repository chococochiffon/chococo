<script setup lang="ts">
import type { LayoutBlock, LayoutRegion } from '~/types/api'

// レイアウトの部品1つを、部品の種類と置いた領域に応じて表示する(見出しは領域の部品側で表示する)
defineProps<{
  block: LayoutBlock
  region: LayoutRegion
}>()
</script>

<template>
  <LayoutSiteTitle v-if="block.block_type === 'site_title'" :region="region" />
  <LayoutNavMenu v-else-if="block.block_type === 'nav_menu'" :block="block" :region="region" />
  <LayoutSocialLinks v-else-if="block.block_type === 'social_links'" />
  <LayoutCopyright v-else-if="block.block_type === 'copyright'" />
  <!-- eslint-disable-next-line vue/no-v-html -- 管理者が作成した HTML(biscuit で許可したタグだけにしたもの)を表示する -->
  <div v-else-if="block.block_type === 'free_text' && block.content" class="rich-content small" v-html="block.content" />
  <LayoutCallContent
    v-else-if="block.block_type === 'call_content' && block.call_content"
    :call-content="block.call_content"
    :region="region"
  />
</template>
