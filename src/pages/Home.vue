<script setup lang="ts">
    import { NButton } from 'naive-ui'
    import { useRouter, useRoute } from 'vue-router'
    const router = useRouter()

    function openAccounting() {
        router.push("/accounting")
    }
</script>

<template>
    <div>
        <h1>Home</h1>
        <n-button id="button" @click="openAccounting">Click me</n-button>
        <div id="modal"></div>
    </div>  
</template>

<style lang="css">

</style>