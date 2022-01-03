<template>
  <v-ace-editor
    :value="code"
    @update:value="$emit('update:code', $event)"
    @init="editorInit"
    lang="c_cpp"
    theme="chrome"
    style="height: 300px"
    ref="ace"
  />
</template>

<script>
import { VAceEditor } from 'vue3-ace-editor'
import 'ace-builds/src-noconflict/mode-c_cpp'
import 'ace-builds/src-noconflict/theme-chrome'

export default {
  name: 'Editor',
  components: {
    VAceEditor
  },
  props: ['code'],
  emits: ['update:code'],
  methods: {
    editorInit () {
      console.log('editor init')
    }
  },
  mounted () {
    console.log(this.$refs.ace)
  }
}
</script>
