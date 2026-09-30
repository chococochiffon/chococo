<script setup lang="ts">
import { MAX_SKILL_LEVEL } from '~/types/api'

// ユーザー詳細のスキルの入力欄(行の追加・削除と、スキル名・習熟度)。マイページのプロフィールと招待の受諾で共通に使う。
// 入力エラーは biscuit の項目名(user_detail.skills.{行}.name)で受け取る
export interface SkillRow {
  id: number | null
  name: string
  level: number
}

const rows = defineModel<SkillRow[]>({ required: true })

defineProps<{
  errors: Record<string, string>
}>()

function add() {
  rows.value.push({ id: null, name: '', level: 1 })
}

function remove(index: number) {
  rows.value.splice(index, 1)
}
</script>

<template>
  <div>
    <div class="form-label">スキル</div>
    <div v-for="(skill, index) in rows" :key="skill.id ?? `new-${index}`" class="row g-2 align-items-start mb-2">
      <div class="col-7 col-md-5">
        <input
          v-model="skill.name"
          type="text"
          class="form-control form-control-sm"
          :class="{ 'is-invalid': errors[`user_detail.skills.${index}.name`] }"
          placeholder="スキル名"
          aria-label="スキル名"
        >
        <div class="invalid-feedback">{{ errors[`user_detail.skills.${index}.name`] }}</div>
      </div>
      <div class="col-auto">
        <select v-model.number="skill.level" class="form-select form-select-sm" aria-label="習熟度">
          <option v-for="level in MAX_SKILL_LEVEL" :key="level" :value="level">{{ '★'.repeat(level) }}</option>
        </select>
      </div>
      <div class="col-auto">
        <button type="button" class="btn btn-outline-danger btn-sm" aria-label="削除" @click="remove(index)">−</button>
      </div>
    </div>
    <button type="button" class="btn btn-outline-secondary btn-sm" @click="add">+ スキルを追加</button>
  </div>
</template>
