<template>
  <div class="flex flex-col">
    <p class="bg-green-700 text-white text-center flex-0">Code Editor</p>
    <v-ace-editor
      :value="code"
      :options="{ printMargin: false }"
      @update:value="$emit('update:code', $event)"
      @init="editorInit"
      lang="c_cpp"
      theme="chrome"
      ref="ace"
      class="flex-1"
    />
    <div class="mt-1 flex justify-between">
      <div>
        <label for="language">Language: </label>
        <select name="language" id="language">
          <option value="c">C</option>
          <option value="wiring" selected>Wiring</option>
        </select>
      </div>
      <div>
        <button class="btn btn-blue">Upload</button>
      </div>
    </div>
  </div>
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

<style scoped>
.btn {
  @apply font-bold py-2 px-4 rounded;
}
.btn-blue {
  @apply bg-blue-500 text-white;
}
.btn-blue:hover {
  @apply bg-blue-700;
}
</style>
