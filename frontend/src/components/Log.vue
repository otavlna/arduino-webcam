<template>
<div>
  <!-- <p class="bg-gray-700 text-white text-center">Debug Log</p> -->
  <div class="bg-black pa-2 h-full">
    <ul class="flex flex-col text-white font-monospace">
      <li v-for="(m, i) in messages" :key="i" class="mt-2 px-4" v-html="m" />
    </ul>
  </div>
</div>

</template>

<script>
export default {
  name: 'Log',
  props: {
    messages: Array
  }
}
</script>

<style>
</style>
