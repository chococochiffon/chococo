<script setup lang="ts">
// ヘッダー・フッターは、biscuit のレイアウト管理で置いた部品を表示する
// (サイドバーはページの種類ごとに位置が変わるため、各ページが LayoutSidebarFrame で本文を包んで表示する)
const { data: layout } = await useSiteLayout()

// ヘッダー(sticky)の実際の高さを CSS 変数 --header-height に入れ、トップのスライダーなどが
// ヘッダーを除いた画面の高さに収まるよう計算できるようにする(画面幅やメニューの開閉で高さが変わるため監視する)
const header = ref<HTMLElement>()
let observer: ResizeObserver | undefined

onMounted(() => {
  observer = new ResizeObserver(([entry]) => {
    document.documentElement.style.setProperty('--header-height', `${Math.round(entry!.borderBoxSize[0]!.blockSize)}px`)
  })
  observer.observe(header.value!)
})
onBeforeUnmount(() => observer?.disconnect())
</script>

<template>
  <div>
    <!-- header start -->
    <header ref="header" class="sticky-top">
      <LayoutHeader :blocks="layout?.regions.header ?? []" />
    </header>
    <!-- header end -->
    <!-- main start -->
    <main>
      <slot />
    </main>
    <!-- main end -->
    <!-- footer start -->
    <LayoutFooter :blocks="layout?.regions.footer ?? []" />
    <!-- footer end -->
  </div>
</template>
