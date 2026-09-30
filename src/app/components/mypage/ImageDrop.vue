<script setup lang="ts">
// 画像の選択欄。画像をドラッグ&ドロップするか、クリックしてファイルを選ぶと select で 1 枚渡す
const props = defineProps<{
  id?: string
  disabled?: boolean
  invalid?: boolean
  label?: string
}>()

const emit = defineEmits<{ select: [file: File] }>()

const input = ref<HTMLInputElement>()
// 画像を上に重ねているか(dragenter/dragleave は子要素でも起きるため、数で数える)
const dragDepth = ref(0)

function open() {
  if (!props.disabled) {
    input.value?.click()
  }
}

function pick(file: File | undefined) {
  if (!file || props.disabled || !file.type.startsWith('image/')) {
    return
  }

  emit('select', file)
}

function onChange(event: Event) {
  const target = event.target as HTMLInputElement
  pick(target.files?.[0])
  // 同じファイルを続けて選んでも change が起きるように空にする
  target.value = ''
}

function onDragEnter() {
  dragDepth.value++
}

function onDragLeave() {
  dragDepth.value = Math.max(0, dragDepth.value - 1)
}

function onDrop(event: DragEvent) {
  dragDepth.value = 0
  pick(event.dataTransfer?.files?.[0])
}
</script>

<template>
  <div
    class="mypage-image-drop"
    :class="{ 'is-dragover': dragDepth > 0 && !disabled, 'is-invalid': invalid, 'is-disabled': disabled }"
    role="button"
    :tabindex="disabled ? -1 : 0"
    :aria-label="label ?? '画像を選択'"
    :aria-disabled="disabled || undefined"
    @click="open"
    @keydown.enter.prevent="open"
    @keydown.space.prevent="open"
    @dragenter.prevent="onDragEnter"
    @dragover.prevent
    @dragleave.prevent="onDragLeave"
    @drop.prevent="onDrop"
  >
    <i class="bi bi-cloud-arrow-up fs-3 d-block" />
    <span class="small">画像をドラッグ&ドロップ<br>またはクリックして選択</span>
    <input :id="id" ref="input" type="file" accept="image/*" class="d-none" :disabled="disabled" @change="onChange">
  </div>
</template>
