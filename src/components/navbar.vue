<script setup lang="ts">
  const route = useRoute();
</script>

<template>
  <section class="d-flex align-items-center border-bottom nav-bg-color">
    <div class="container">
      <div class="py-1 mb-4">
        <!-- nav start -->
        <nav id="navbar-example2" class="navbar navbar-light navbar-expand-md">
          <div class="container-fluid">
            <a href="/" class="navbar-brand d-flex align-items-center mb-3 mb-md-0 me-md-auto link-body-emphasis text-decoration-none">
                <span class="fs-4">
                  Chococo Games
                </span>
            </a>
            <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbar" aria-controls="navbar" aria-expanded="false" aria-label="navbar">
              <span class="navbar-toggler-icon"></span>
            </button>
            <div class="collapse navbar-collapse" id="navbar">
              <ul class="nav navbar-nav ms-auto mb-2">
                <li class="nav-item">
                  <a href="/" v-bind:class="{'active': route.path === '/'}" class="nav-link" aria-current="page">Home</a>
                </li>
                <li class="nav-item">
                  <a href="#about" v-bind:class="{'active': route.path === '/#about'}" class="nav-link">About</a>
                </li>
                <li class="nav-item">
                  <a href="#profile" v-bind:class="{'active': route.path === '/#profile'}" class="nav-link">Profile</a>
                </li>
                <li class="nav-item">
                  <a href="#faq" v-bind:class="{'active': route.path === '/#faq'}" class="nav-link">FAQs</a>
                </li>
              </ul>
            </div>
          </div>
        </nav>
        <!-- nav end -->
      </div>
    </div>
  </section>
</template>

<style scoped>

</style>