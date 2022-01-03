<template>
  <Editor v-model:code="code" />
</template>

<script>
import Editor from './components/Editor.vue'

export default {
  name: 'App',
  components: {
    Editor
  },
  data () {
    return {
      code: ''
    }
  }
}
</script>
