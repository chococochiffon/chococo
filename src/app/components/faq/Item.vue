<script setup lang="ts">
import type { QuestionAnswer } from '~/types/api'

// FAQ の 1 件(旧 FAQs セクションのアコーディオンのデザイン)。簡易版は開くと回答を表示し、分岐ありは開くと回答を選んで進む
const props = defineProps<{
  questionAnswer: QuestionAnswer
}>()

const isOpen = ref(false)
const bodyId = computed(() => `faq-${props.questionAnswer.id}`)

const questionText = computed(() =>
  props.questionAnswer.top_view
    ? props.questionAnswer.short_question_text
    : props.questionAnswer.question?.question_text,
)
</script>

<template>
  <div class="accordion-item shadow p-2 m-3 rounded" data-aos="fade-up" data-aos-delay="100">
    <h3 class="accordion-header">
      <button
        class="accordion-button fs-6"
        :class="{ collapsed: !isOpen }"
        type="button"
        :aria-expanded="isOpen"
        :aria-controls="bodyId"
        @click="isOpen = !isOpen"
      >
        <i class="bi bi-question-circle question-icon" /><span class="m-1 p-1 faq-text">{{ questionText }}</span>
      </button>
    </h3>
    <div v-show="isOpen" :id="bodyId" class="accordion-collapse">
      <div class="accordion-body">
        <p v-if="questionAnswer.top_view" class="mb-0">
          <i class="bi bi-check2 answer-icon" /><span class="m-1 p-1 faq-text">{{ questionAnswer.short_answer_text }}</span>
        </p>
        <FaqFlow v-else-if="questionAnswer.question" :question="questionAnswer.question" />
      </div>
    </div>
  </div>
</template>
