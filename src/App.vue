<script setup lang="ts">

console.log("[App.vue]", `Hello world from Electron ${process.versions.electron}!`)
</script>

<template>
  <div class="flex">
    <router-view></router-view>
  </div>
</template>
