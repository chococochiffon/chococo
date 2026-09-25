<script setup lang="ts">
import type { QaAnswer, QaQuestion } from '~/types/api'

// 分岐ありの Q&A: 質問ごとに回答を選ぶと次の質問へ進み、分岐先のない回答を選んだらその回答文を表示して終わる。
// 前の質問の回答を選び直すと、そこから先をやり直す
const props = defineProps<{
  question: QaQuestion
}>()

// 各質問で選んだ回答(先頭が最初の質問)
const selected = ref<QaAnswer[]>([])

interface Step {
  question: QaQuestion
  selected: QaAnswer | null
}

const steps = computed<Step[]>(() => {
  const result: Step[] = []
  let question: QaQuestion | null = props.question

  for (let index = 0; question; index++) {
    const answer = selected.value[index] ?? null
    result.push({ question, selected: answer })
    question = answer?.question ?? null
  }

  return result
})

// 最後に選んだ回答が分岐先を持たなければ、その回答文が最終的な回答になる
const finalAnswer = computed(() => {
  const last = steps.value.at(-1)?.selected
  return last && !last.question ? last : null
})

function choose(stepIndex: number, answer: QaAnswer) {
  selected.value = [...selected.value.slice(0, stepIndex), answer]
}

function reset() {
  selected.value = []
}
</script>

<template>
  <div>
    <div v-for="(step, stepIndex) in steps" :key="step.question.id" class="mb-3">
      <p v-if="stepIndex > 0" class="mb-2">
        <i class="bi bi-question-circle question-icon" /><span class="m-1 p-1">{{ step.question.question_text }}</span>
      </p>
      <div class="d-flex flex-wrap gap-2 ms-4">
        <button
          v-for="answer in step.question.answers"
          :key="answer.id"
          type="button"
          class="btn btn-sm"
          :class="step.selected?.id === answer.id ? 'btn-secondary' : 'btn-outline-secondary'"
          :aria-pressed="step.selected?.id === answer.id"
          @click="choose(stepIndex, answer)"
        >
          {{ answer.answer_text || '次へ' }}
        </button>
      </div>
    </div>

    <div v-if="finalAnswer" class="border-top pt-3">
      <p class="mb-2">
        <i class="bi bi-check2 answer-icon" /><span class="m-1 p-1 faq-text">{{ finalAnswer.answer_text }}</span>
      </p>
      <button type="button" class="btn btn-sm btn-link px-0" @click="reset">
        <i class="bi bi-arrow-counterclockwise" /> 最初からやり直す
      </button>
    </div>
  </div>
</template>
