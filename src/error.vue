<script setup lang="ts">
const error = useError();
</script>
<template>
  <div class="container">
    <div class="text-center m-4 p-4">
      <p>This is Error Page...</p>
      <p>Status : {{ error.statusCode }}</p>
      <p>Message : {{ error.statusMessage }}</p>
    </div>
  </div>
</template>

<style scoped>

</style>