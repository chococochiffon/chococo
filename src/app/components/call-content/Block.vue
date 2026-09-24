<script setup lang="ts">
import type { CallContent } from '~/types/api'

// 呼び出しコンテンツ1枠を、呼び出し方(call_type)に応じた部品で表示する。見出しには title・subtitle を使う
const props = defineProps<{
  callContent: CallContent
}>()

const content = computed(() => callContentItems(props.callContent))
const articles = computed(() => (content.value.kind === 'articles' ? content.value.items : []))
const singlePages = computed(() => (content.value.kind === 'single_pages' ? content.value.items : []))
const userDetails = computed(() => (content.value.kind === 'user_details' ? content.value.items : []))
const linkItems = computed(() => toLinkItems(content.value))
</script>

<template>
  <template v-if="callContent.call_type === 'original_text'">
    <PageArticleBody v-if="articles[0]" :article="articles[0]" />
    <PageSinglePageBody v-else-if="singlePages[0]" :page="singlePages[0]" />
  </template>
  <CallContentShortSentence
    v-else-if="callContent.call_type === 'short_sentence' && singlePages.length"
    :title="callContent.title"
    :subtitle="callContent.subtitle"
    :pages="singlePages"
  />
  <CallContentArchive
    v-else-if="callContent.call_type === 'archive' && articles.length"
    :title="callContent.title"
    :subtitle="callContent.subtitle"
    :articles="articles"
  />
  <CallContentSkillList
    v-else-if="callContent.call_type === 'skill_list' && userDetails.length"
    :title="callContent.title"
    :subtitle="callContent.subtitle"
    :user-details="userDetails"
  />
  <CallContentLink
    v-else-if="callContent.call_type === 'link' && linkItems[0]"
    :title="callContent.title"
    :subtitle="callContent.subtitle"
    :item="linkItems[0]"
  />
  <CallContentLinkList
    v-else-if="callContent.call_type === 'link_list' && linkItems.length"
    :title="callContent.title"
    :subtitle="callContent.subtitle"
    :items="linkItems"
  />
</template>
