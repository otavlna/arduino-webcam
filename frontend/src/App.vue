<template>
  <header class="bg-white py-4">
    <div class="lg:mx-20 mx-5">
      <h1><font-awesome-icon icon="camera" /> Arduino Webcam</h1>
    </div>
  </header>
  <main class="mx-5 flex flex-col items-stretch main pb-2">
    <div class="flex gap-x-10 mr-10 h-full">
      <div class="flex-left h-full">
        <Editor class="h-full" v-model:code="code" />
      </div>
      <div class="flex-right h-full flex flex-col">
        <Log :messages="messages" class="bg-white overflow-y-auto flex-1" />
        <player class="w-full flex-1" />
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
      messages: ['ahoj', 'ahoj2', 'ahoj3'],
      ws: null
    }
  },
  created () {
    // Create WebSocket connection.
    this.ws = new WebSocket('ws://localhost:1337')

    // Connection opened
    this.ws.addEventListener('open', (event) => {
      this.ws.send('Hello Server!')
    })

    // Listen for messages
    this.ws.addEventListener('message', (event) => {
      console.log('Message from server ', event.data)
      this.ws.send('Hello Server!')
    })
  }
}
</script>

<style scoped>
.main {
  height: calc(100% - 56px)
}
</style>
