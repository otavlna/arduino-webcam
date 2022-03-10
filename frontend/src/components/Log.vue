<template>
<div>
  <div class="bg-black pa-2 min-h-full">
    <ul class="flex flex-col text-white font-monospace" ref="messages">
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
  },
  watch: {
    messages: {
      deep: true,
      handler () {
        this.$nextTick(() => {
          this.$refs.messages.children[this.$refs.messages.children.length - 1].scrollIntoView({ behavior: 'smooth', block: 'end', inline: 'nearest' })
        })
      }
    }
  }
}
</script>

<style>
</style>
