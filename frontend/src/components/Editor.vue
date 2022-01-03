<template>
  <v-ace-editor
    :value="code"
    :options="{printMargin: false}"
    @update:value="$emit('update:code', $event)"
    @init="editorInit"
    lang="c_cpp"
    theme="one_dark"
    style="height: 300px; font-size: 15px"
    ref="ace"
  />
</template>

<script>
import { VAceEditor } from 'vue3-ace-editor'
import 'ace-builds/src-noconflict/mode-c_cpp'
import 'ace-builds/src-noconflict/theme-one_dark'

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
