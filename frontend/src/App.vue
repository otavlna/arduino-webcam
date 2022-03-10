<template>
  <header class="py-4">
    <div class="lg:mx-20 mx-5">
      <h1 class="text-primary"><font-awesome-icon icon="camera" /> Arduino Webcam</h1>
    </div>
  </header>
  <main class=" flex flex-col items-stretch main pb-2">
    <div class="flex h-full">
      <div class="flex-left h-full">
        <Editor class="h-full" v-model:code="code" v-model:lang="lang" @upload="upload" />
      </div>
      <div class="flex-right h-full flex flex-col">
        <Log :messages="messages" class="bg-white overflow-y-auto flex-1" />
        <Player class="w-full flex-1" />
      </div>
    </div>
  </main>
</template>

<script>
import Editor from './components/Editor.vue'
import Log from './components/Log.vue'
import Player from './components/Player.vue'

export default {
  name: 'App',
  components: {
    Editor,
    Log,
    Player
  },
  data () {
    return {
      code: '',
      lang: 'wiring',
      messages: ['Waiting for input...'],
      ws: null
    }
  },
  methods: {
    upload () {
      this.ws.send(JSON.stringify({ code: this.code, lang: this.lang }))
    },
    formatMessage (message) {
      const formatted = message.replace(/\n/g, '<br />')
      return formatted
    }
  },
  created () {
    this.ws = new WebSocket('ws://localhost:1337')

    this.ws.addEventListener('open', (event) => {
      this.ws.addEventListener('message', (event) => {
        const message = JSON.parse(event.data)
        if (message.type === 'log') {
          if (message.stderr) {
            this.messages.push(this.formatMessage(message.stderr))
          }
        }
      })
    })

    this.ws.addEventListener('message', (event) => {
      console.log('Message from server ', event.data)
    })
  }
}
</script>

<style scoped>
.main {
  height: calc(100% - 56px)
}
</style>
