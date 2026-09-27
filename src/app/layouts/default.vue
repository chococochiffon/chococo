<script setup lang="ts">
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
      <AppNavbar />
    </header>
    <!-- header end -->
    <!-- main start -->
    <main>
      <slot />
    </main>
    <!-- main end -->
    <!-- footer start -->
    <AppFooter />
    <!-- footer end -->
  </div>
</template>
