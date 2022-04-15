<template>
<div>
  <div class="bg-black min-h-full px-3 py-2">
    <ul class="text-white font-monospace" ref="messages">
      <li v-for="(m, i) in messages" :key="i" class="inline">
        <span v-if="m.stdout" v-html="m.stdout"></span>
        <span v-if="m.stderr" v-html="m.stderr" class="text-red-600"></span>
      </li>
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
          this.$refs.messages.children[this.$refs.messages.children.length - 1].scrollIntoView({ behavior: 'auto', block: 'end', inline: 'nearest' })
        })
      }
    }
  }
}
</script>
