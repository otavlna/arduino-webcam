<template>
  <header class="py-4">
    <div class="lg:mx-20 mx-5 flex">
      <h1 class="text-primary">
        <font-awesome-icon icon="camera" />
        Arduino Webcam
      </h1>
      <div class="ml-5">
        <span v-if="websocketReady" class="text-green-600">
          <font-awesome-icon icon="wifi" />
          Connected
        </span>
        <span v-else class="text-red-600">
          <font-awesome-icon icon="exclamation-circle" />
          Trying to reconnect...
        </span>
      </div>
      <div class="ml-auto">
        <span class="text-primary mr-5" v-if="isRunning">
            Current user time left: {{ queueTimeLeft }} s
        </span>
        <span class="text-green-600" v-if="myTurn">Your turn</span>
        <span class="text-yellow-600" v-else-if="queueLength > 0 && !waitingForTurn">Queue length: {{ queueLength }}</span>
        <span class="text-yellow-600" v-else-if="queueLength > 0 && waitingForTurn">Queue position: {{queuePosition}}/{{ queueLength }}</span>
        <span class="text-primary" v-else>Queue empty</span>
      </div>
    </div>
  </header>
  <main class="main flex flex-row">
    <Editor
      class="flex-grow"
      v-model:code="code"
      v-model:lang="lang"
      :canUpload="websocketReady && !waitingForTurn"
      :waitingInQueue="queuePosition > 0"
      :currentCode="currentCode"
      @upload="upload"
    />
    <div class="log-player-container flex flex-col">
      <Log :messages="messages" class="bg-white overflow-y-auto flex-grow" />
      <Player />
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
      messages: [{ stdout: 'Waiting for input... <br />' }],
      ws: null,
      websocketReady: false,
      queueLength: null,
      timeoutStartTime: null,
      timeoutLength: null,
      isRunning: false,
      dateNow: 0,
      myTurn: false,
      queuePosition: null,
      currentCode: ''
    }
  },
  computed: {
    queueTimeLeft () {
      return (((this.timeoutStartTime + this.timeoutLength) - this.dateNow) * 0.001).toFixed(0)
    },
    waitingForTurn () {
      return this.queuePosition !== null
    }
  },
  methods: {
    establishConnection () {
      this.ws = new WebSocket('ws://localhost:1337')

      this.ws.addEventListener('open', (event) => {
        console.log(this.ws)
        console.log('socket connected')
        this.websocketReady = true
      })

      this.ws.addEventListener('message', (event) => {
        const message = JSON.parse(event.data)
        console.log(message)

        switch (message.type) {
          case 'log':
            this.messages.push(this.formatMessage(message))
            break
          case 'queue':
            this.timeoutStartTime = message.timeoutStartTime
            this.timeoutLength = message.timeoutLength
            this.queueLength = message.queueLength
            this.isRunning = message.isRunning
            break
          case 'requestComplete':
            this.myTurn = false
            this.queuePosition = null
            break
          case 'yourTurn':
            this.myTurn = true
            break
          case 'queuePosition':
            this.queuePosition = message.position
            break
          case 'currentCode':
            this.currentCode = message.code
            break
        }
      })

      this.ws.addEventListener('error', (event) => {
        console.log('socket encountered error')
        this.ws.close()
      })

      this.ws.addEventListener('close', (event) => {
        console.log('socket closed, trying to reconnect')
        this.websocketReady = false
        setTimeout(() => {
          this.establishConnection()
        }, 1000)
      })
    },
    upload () {
      this.ws.send(JSON.stringify({ code: this.code, lang: this.lang }))
    },
    formatMessage (message) {
      if (message.stdout) {
        // eslint-disable-next-line no-control-regex
        message.stdout = message.stdout.replace(/\n/g, '<br />').replace(/[\u001b\u009b][[()#;?]*(?:[0-9]{1,4}(?:;[0-9]{0,4})*)?[0-9A-ORZcf-nqry=><]/g, '')
      }
      if (message.stderr) {
        // eslint-disable-next-line no-control-regex
        message.stderr = message.stderr.replace(/\n/g, '<br />').replace(/[\u001b\u009b][[()#;?]*(?:[0-9]{1,4}(?:;[0-9]{0,4})*)?[0-9A-ORZcf-nqry=><]/g, '')
      }
      return message
    },
    dateNowUpdate () {
      this.dateNow = Date.now()
    }
  },
  created () {
    setInterval(this.dateNowUpdate.bind(this), 100)
    this.establishConnection()
  }
}
</script>

<style scoped>
.main {
  height: calc(100% - 56px);
}

.log-player-container {
  width: 832px;
}

</style>
