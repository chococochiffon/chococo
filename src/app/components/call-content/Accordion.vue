<script setup lang="ts">
import type { QuestionAnswer } from '~/types/api'

// 開閉パネル: 簡易版の Q&A を開閉できるパネルで並べ、FAQ ページへ案内する
defineProps<{
  title: string | null
  subtitle: string | null
  questionAnswers: QuestionAnswer[]
}>()
</script>

<template>
  <div class="container">
    <div class="row py-5">
      <SectionHeading :title="title" :subtitle="subtitle" />
      <div class="col-lg-12">
        <div class="accordion accordion-flush">
          <FaqItem v-for="questionAnswer in questionAnswers" :key="questionAnswer.id" :question-answer="questionAnswer" />
        </div>
      </div>
      <div class="col-lg-12 text-center mt-3">
        <NuxtLink to="/faq" class="btn btn-outline-secondary">FAQ 一覧へ</NuxtLink>
      </div>
    </div>
  </div>
</template>
