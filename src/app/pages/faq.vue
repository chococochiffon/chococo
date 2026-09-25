<script setup lang="ts">
import type { QuestionAnswer } from '~/types/api'

// FAQ(biscuit の Q&A を登録順に並べる)。簡易版・分岐ありの両方を表示する
const { data: allQuestionAnswers, error } = await useQuestionAnswers()

// 分岐ありで最初の質問が未登録のもの(表示できる質問がないもの)は除く
const questionAnswers = computed<QuestionAnswer[]>(() =>
  (allQuestionAnswers.value ?? []).filter(questionAnswer =>
    questionAnswer.top_view ? Boolean(questionAnswer.short_question_text) : Boolean(questionAnswer.question),
  ),
)

if (error.value) {
  throw createError({ statusCode: error.value.statusCode ?? 500, statusMessage: 'Server Error', fatal: true })
}

useSeoMeta({
  title: 'FAQ',
  ogTitle: 'FAQ',
})
</script>

<template>
  <div class="container">
    <div class="row py-5">
      <SectionHeading title="FAQs" subtitle="聞いてみたいこと" />
      <div v-if="questionAnswers.length" class="col-lg-12">
        <div class="accordion accordion-flush">
          <FaqItem v-for="questionAnswer in questionAnswers" :key="questionAnswer.id" :question-answer="questionAnswer" />
        </div>
      </div>
      <p v-else class="col-lg-12 text-center text-body-secondary">FAQ はまだありません。</p>
    </div>
  </div>
</template>
