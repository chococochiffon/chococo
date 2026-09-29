<script setup lang="ts">
import type { Tag } from '~/types/api'

// 記事のタグの入力。名前を入れると登録済みのタグを候補に出し、Enter か候補の選択で追加する(未登録の名前は保存時に作られる)
const tags = defineModel<string[]>({ default: () => [] })

const keyword = ref('')
const suggestions = ref<Tag[]>([])
let timer: ReturnType<typeof setTimeout> | undefined

watch(keyword, (value) => {
  clearTimeout(timer)

  if (value.trim() === '') {
    suggestions.value = []

    return
  }

  timer = setTimeout(async () => {
    const response = await $fetch<{ data: Tag[] }>('/api/me/tags', { query: { q: value.trim() } }).catch(() => ({ data: [] }))
    suggestions.value = response.data.filter(tag => !tags.value.includes(tag.name))
  }, 250)
})

function add(name: string) {
  const trimmed = name.trim()

  if (trimmed !== '' && !tags.value.includes(trimmed)) {
    tags.value = [...tags.value, trimmed]
  }

  keyword.value = ''
  suggestions.value = []
}

function remove(name: string) {
  tags.value = tags.value.filter(tag => tag !== name)
}
</script>

<template>
  <div class="position-relative">
    <div v-if="tags.length" class="d-flex flex-wrap gap-2 mb-2">
      <span v-for="tag in tags" :key="tag" class="badge rounded-pill text-bg-light border d-inline-flex align-items-center gap-1">
        #{{ tag }}
        <button type="button" class="btn-close" style="font-size: 0.5rem;" :aria-label="`タグ「${tag}」を外す`" @click="remove(tag)" />
      </span>
    </div>
    <input
      id="my-article-tags"
      v-model="keyword"
      type="text"
      class="form-control"
      placeholder="タグ名を入力して Enter"
      autocomplete="off"
      @keydown.enter.prevent="add(keyword)"
    >
    <div v-if="suggestions.length" class="list-group position-absolute w-100 shadow-sm" style="z-index: 10;">
      <button v-for="tag in suggestions" :key="tag.id" type="button" class="list-group-item list-group-item-action" @click="add(tag.name)">
        {{ tag.name }}
      </button>
    </div>
  </div>
</template>
