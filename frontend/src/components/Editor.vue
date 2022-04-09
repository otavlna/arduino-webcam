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
            @input="selectLang($event.target.value)"
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
            :value="selectedSnippet.name"
            @input="selectSnippet($event.target.value)"
          >
            <option
              v-for="(snippet) in currentSnippets"
              :key="snippet.name"
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

        <p v-if="editDisabled && currentLang" class="text-primary mr-2">Language: {{ currentLang }}</p>

        <p v-if="editDisabled" class="font-bold text-red-600">Showing currently running code. Editing disabled!</p>

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
          @click="saveFile()"
        >
          <font-awesome-icon icon="file-download" /> Download
        </button>
        <button
          v-if="!editDisabled"
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
          @click="handleUpload"
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
import { saveAs } from 'file-saver'

export default {
  name: 'Editor',
  components: {
    VAceEditor
  },
  data () {
    return {
      selectedCode: 'my',
      selectedSnippet: null
    }
  },
  computed: {
    snippets () {
      return snippets
    },
    currentSnippets () {
      if (this.lang === 'c') return this.snippets.c
      return this.snippets.wiring
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
  created () {
    this.selectedSnippet = this.currentSnippets[0]
    this.$emit('update:code', this.selectedSnippet.code)
  },
  props: ['code', 'lang', 'canUpload', 'waitingInQueue', 'currentCode', 'currentLang'],
  emits: ['update:code', 'update:lang', 'upload'],
  methods: {
    editorInit () {
      console.log('editor init')
    },
    handleUpload () {
      if (this.canUpload) {
        this.$emit('upload')
      }
    },
    saveFile () {
      const file = new Blob([this.shownCode])
      let fileExtension
      if (this.editDisabled) {
        fileExtension = this.currentLang === 'wiring' ? 'ino' : 'c'
      } else {
        fileExtension = this.lang === 'wiring' ? 'ino' : 'c'
      }
      saveAs(file, `code.${fileExtension}`)
    },
    selectSnippet (snippet, makePrompt = true) {
      this.selectedSnippet = this.currentSnippets.find((s) => s.name === snippet)
      if (makePrompt) {
        if (confirm('This action will overwrite your current code. Continue?')) {
          this.$emit('update:code', this.selectedSnippet.code)
        }
      } else {
        this.$emit('update:code', this.selectedSnippet.code)
      }
    },
    selectLang (lang) {
      if (confirm('This action will overwrite your current code. Continue?')) {
        this.$emit('update:lang', lang)
        this.$nextTick(() => {
          this.selectSnippet('Default (empty)', false)
        })
      }
    }
  }
}
</script>
