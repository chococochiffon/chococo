<template>
  <div>
    <!-- header start -->
    <header class="sticky-top">
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
