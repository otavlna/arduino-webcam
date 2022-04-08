<template>
  <div class="flex flex-col">
    <!-- <p class="bg-gray-700 text-white text-center flex-0">Code Editor</p> -->
    <v-ace-editor
      :value="shownCode"
      :options="{ printMargin: false, fontSize: '17px', useWorker: true }"
      :readonly="editDisabled"
      @update:value="$emit('update:code', $event)"
      @init="editorInit"
      lang="c_cpp"
      theme="twilight"
      ref="ace"
      class="flex-1"
    />
    <div class="mt-1 mx-3 flex">
      <div>
        <div class="inline" v-if="!editDisabled">
          <label class="text-primary whitespace-nowrap" for="language">Language: </label>
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
        </div>

        <div class="inline" v-if="!editDisabled">
          <label class="text-primary whitespace-nowrap" for="snippet">Code snippet: </label>
          <select
            class="
              text-primary
              bg-background
              border-solid border-2 border-primary
              mr-3
            "
            name="snippet"
            id="snippet"
          >
            <option
              v-for="snippet in currentSnippets"
              v-bind:value="snippets.indexOf(snippet)"
              :key="snippets.indexOf(snippet)"
            >
              {{ snippet.name }}
            </option>
          </select>
        </div>
      </div>

       <div class="inline">
          <label class="text-primary whitespace-nowrap" for="selectedCode">Show: </label>
          <select
            class="
              text-primary
              bg-background
              mr-3
              border-solid border-2 border-primary
            "
            name="selectedCode"
            id="selectedCode"
            @input="selectedCode = $event.target.value"
            :value="selectedCode"
          >
            <option value="my" selected>My code</option>
            <option value="current">Current code</option>
          </select>
        </div>

        <p class="font-bold text-red-600" v-if="editDisabled">Showing currently running code. Editing disabled!</p>

      <div class="ml-auto">
        <button
          class="
            mr-2
            bg-btn
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
            bg-btn
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
            bg-btn
            hover:bg-buttonHover
            text-blue-500
            py-2
            px-4
            rounded
          "
          :class="!canUpload ? 'opacity-30 cursor-not-allowed' : ''"
          @click="handleClick"
        >
          <font-awesome-icon icon="upload" :disabled="!canUpload || waitingInQueue" />
          Upload to Arduino
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import { VAceEditor } from 'vue3-ace-editor'
import 'ace-builds/src-noconflict/mode-c_cpp'
import 'ace-builds/src-noconflict/theme-twilight'
import snippets from '../snippets'

export default {
  name: 'Editor',
  components: {
    VAceEditor
  },
  data () {
    return {
      selectedCode: 'my'
    }
  },
  computed: {
    snippets () {
      return snippets
    },
    cSnippets () {
      return snippets.filter((snippet) => snippet.lang === 'c')
    },
    wiringSnippets () {
      return snippets.filter((snippet) => snippet.lang === 'wiring')
    },
    currentSnippets () {
      if (this.lang === 'c') return this.cSnippets
      return this.wiringSnippets
    },
    shownCode () {
      if (this.selectedCode === 'my') {
        return this.code
      } else if (this.selectedCode === 'current') {
        return this.currentCode
      }
      return ''
    },
    editDisabled () {
      return this.selectedCode !== 'my'
    }
  },
  props: ['code', 'lang', 'canUpload', 'waitingInQueue', 'currentCode'],
  emits: ['update:code', 'update:lang', 'upload'],
  methods: {
    editorInit () {
      console.log('editor init')
    },
    handleClick () {
      if (this.canUpload) {
        this.$emit('upload')
      }
    }
  }
}
</script>
