<template>
  <div class="flex flex-col">
    <!-- <p class="bg-gray-700 text-white text-center flex-0">Code Editor</p> -->
    <v-ace-editor
      :value="code"
      :options="{ printMargin: false, fontSize: '17px', useWorker: true }"
      @update:value="$emit('update:code', $event)"
      @init="editorInit"
      lang="c_cpp"
      theme="twilight"
      ref="ace"
      class="flex-1"
    />
    <div class="mt-1 mx-3 flex justify-between">
      <div>
        <label class="text-primary" for="language">Language: </label>
        <select
          class="
            text-primary
            bg-background
            mr-3
            border-solid border-2 border-primary
          "
          name="language"
          id="language"
          @input="$emit('update:lang', $event.target.value)"
          :value="lang"
        >
          <option value="wiring" selected>Wiring</option>
          <option value="c">C</option>
        </select>
        <label class="text-primary" for="snippet">Code snippet: </label>
        <select
          class="
            text-primary
            bg-background
            border-solid border-2 border-primary
          "
          name="snippet"
          id="snippet"
        >
          <option value="default" selected>Default (empty)</option>
          <option value="blink">Blink</option>
          <option value="buzzer">Buzzer</option>
          <option value="millis">Millis</option>
        </select>
      </div>
      <div>
        <button
          class="
            mr-2
            bg-background
            hover:bg-buttonHover
            text-white
            py-2
            px-4
            rounded
          "
          @click="$emit('open-file')"
        >
          <font-awesome-icon icon="file-upload" /> Open
        </button>
        <button
          class="
            mr-2
            bg-background
            hover:bg-buttonHover
            text-white
            py-2
            px-4
            rounded
          "
          @click="$emit('download-file')"
        >
          <font-awesome-icon icon="file-download" /> Download
        </button>
        <button
          class="
            border-solid border-2 border-blue-500
            mr-2
            bg-background
            hover:bg-buttonHover
            text-blue-500
            py-2
            px-4
            rounded"
          :class="!websocketReady ? 'opacity-30 cursor-not-allowed' : ''"
          @click="handleClick"
        >
          <font-awesome-icon icon="upload" :disabled="!websocketReady" />
          Upload to Arduino
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import { VAceEditor } from "vue3-ace-editor";
import "ace-builds/src-noconflict/mode-c_cpp";
import "ace-builds/src-noconflict/theme-twilight";

export default {
  name: "Editor",
  components: {
    VAceEditor,
  },
  props: ["code", "lang", "websocketReady"],
  emits: ["update:code", "update:lang", "upload"],
  methods: {
    editorInit() {
      console.log("editor init");
    },
    handleClick() {
      if (this.websocketReady) {
        this.$emit("upload");
      }
    },
  },
};
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
