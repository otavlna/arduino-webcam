<template>
  <div class="flex flex-col">
    <p class="bg-gray-700 text-white text-center flex-0">Code Editor</p>
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
        <select class="mr-3" name="language" id="language">
          <option value="wiring" selected>Wiring</option>
          <option value="c">C</option>
        </select>
        <label for="snippet">Code snippet: </label>
        <select name="snippet" id="snippet">
          <option value="default" selected>Default (empty)</option>
          <option value="blink">Blink</option>
          <option value="buzzer">Buzzer</option>
          <option value="millis">Millis</option>
        </select>
      </div>
      <div>
        <button class="mr-2 bg-white hover:bg-gray-100 text-gray-800 font-semibold py-2 px-4  rounded"><font-awesome-icon icon="download" /> Download code</button>
        <button class="btn btn-blue" @click="$emit('upload')"><font-awesome-icon icon="upload" /> Upload to Arduino</button>
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
  emits: ['update:code', 'upload'],
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
