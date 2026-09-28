<script setup lang="ts">
import type { CustomField } from '~/types/api'

// カスタムページのカスタムフォームの項目を「項目名: 値」で並べる(未入力の項目は出さない)
const props = defineProps<{
  fields: CustomField[]
}>()

const filledFields = computed(() =>
  props.fields.filter(field => (Array.isArray(field.value) ? field.value.length > 0 : Boolean(field.value))),
)

// 日付は他の日付と同じ「YYYY/MM/DD」、チェックボックスは選んだ値を「、」でつなぐ
function displayValue(field: CustomField): string {
  if (Array.isArray(field.value)) {
    return field.value.join('、')
  }

  return field.type === 'date' ? (field.value ?? '').replaceAll('-', '/') : (field.value ?? '')
}
</script>

<template>
  <div v-if="filledFields.length" class="container pb-5">
    <dl class="row card shadow flex-row mx-0 py-3" data-aos="fade-up" data-aos-delay="100">
      <template v-for="field in filledFields" :key="field.name">
        <dt class="col-sm-3 text-body-secondary fw-normal">{{ field.name }}</dt>
        <dd class="col-sm-9" :class="{ 'field-textarea': field.type === 'textarea' }">
          <a v-if="field.type === 'email'" :href="`mailto:${field.value}`">{{ field.value }}</a>
          <template v-else>{{ displayValue(field) }}</template>
        </dd>
      </template>
    </dl>
  </div>
</template>

<style scoped>
.field-textarea {
  white-space: pre-line;
}
</style>
