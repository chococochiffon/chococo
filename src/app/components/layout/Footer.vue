<script setup lang="ts">
import type { LayoutBlock } from '~/types/api'

// フッター: 見出しを持つ部品(自由テキスト・呼び出しコンテンツ)は上段に列で、
// それ以外(サイトタイトル・ナビメニュー・コピーライト・SNS リンク)は下段に横並びで、それぞれ並び順に置く
const props = defineProps<{
  blocks: LayoutBlock[]
}>()

const hasHeading = (block: LayoutBlock) => block.block_type === 'free_text' || block.block_type === 'call_content'
const columnBlocks = computed(() => props.blocks.filter(hasHeading))
const barBlocks = computed(() => props.blocks.filter(block => !hasHeading(block)))
</script>

<template>
  <footer>
    <div class="container">
      <div v-if="columnBlocks.length" class="row py-4 mt-4 border-top">
        <div v-for="(block, index) in columnBlocks" :key="index" class="col-md-4 mb-3">
          <h5 v-if="block.title" class="fs-6 fw-bold">{{ block.title }}</h5>
          <p v-if="block.subtitle" class="small text-body-secondary mb-2">{{ block.subtitle }}</p>
          <LayoutBlockItem :block="block" region="footer" />
        </div>
      </div>
      <div v-if="barBlocks.length" class="d-flex flex-wrap justify-content-between align-items-center gap-3 py-3 my-4 border-top">
        <LayoutBlockItem v-for="(block, index) in barBlocks" :key="index" :block="block" region="footer" />
      </div>
    </div>
  </footer>
</template>
