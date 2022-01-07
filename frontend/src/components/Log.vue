<template>
<div>
  <p class="bg-gray-700 text-white text-center">Debug Log</p>
  <ul class="flex flex-col-reverse">
    <li v-for="(m, i) in messages" :key="i" class="mt-2 px-4">
      {{ i }} {{ m }}
    </li>
  </ul>
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
