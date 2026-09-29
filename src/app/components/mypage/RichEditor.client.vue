<script setup lang="ts">
import 'quill/dist/quill.snow.css'
import type Quill from 'quill'

// 記事の本文のリッチテキストエディタ(Quill。biscuit の管理画面と同じツールバー)。
// 画像はツールバーから biscuit へアップロードし、返ってきた URL を本文に入れる。
// 保存した本文は biscuit が無害化する(見出しと、ここでアップロードした画像以外の画像は取り除かれる)
const model = defineModel<string>({ default: '' })

defineProps<{
  invalid?: boolean
}>()

const emit = defineEmits<{
  uploadError: [message: string]
}>()

const container = ref<HTMLDivElement>()
let quill: Quill | null = null

onMounted(async () => {
  const { default: QuillEditor } = await import('quill')

  quill = new QuillEditor(container.value!, {
    theme: 'snow',
    modules: {
      toolbar: {
        container: [
          [{ header: [1, 2, 3, false] }],
          ['bold', 'italic', 'underline', 'strike'],
          [{ list: 'ordered' }, { list: 'bullet' }],
          ['link', 'image'],
          ['clean'],
        ],
        handlers: { image: selectImage },
      },
    },
  })

  if (model.value) {
    quill.clipboard.dangerouslyPasteHTML(model.value)
  }

  quill.on('text-change', () => {
    model.value = quill!.root.innerHTML
  })
})

onBeforeUnmount(() => {
  quill = null
})

function selectImage() {
  const input = document.createElement('input')
  input.type = 'file'
  input.accept = 'image/*'
  input.onchange = () => uploadImage(input.files?.[0])
  input.click()
}

async function uploadImage(file: File | undefined) {
  if (!file || !quill) {
    return
  }

  try {
    const body = new FormData()
    body.append('image', file)
    const { url } = await $fetch<{ url: string }>('/api/me/articles/content-images', { method: 'POST', body })
    const range = quill.getSelection(true)
    quill.insertEmbed(range.index, 'image', url, 'user')
  }
  catch (e) {
    emit('uploadError', errorMessage(e, '画像のアップロードに失敗しました。'))
  }
}
</script>

<template>
  <div class="rich-editor" :class="{ 'is-invalid': invalid }">
    <div ref="container" />
  </div>
</template>

<style scoped>
.rich-editor :deep(.ql-container) {
  min-height: 360px;
  font-family: inherit;
  font-size: 1rem;
}

.rich-editor.is-invalid :deep(.ql-toolbar),
.rich-editor.is-invalid :deep(.ql-container) {
  border-color: var(--bs-form-invalid-border-color);
}
</style>
