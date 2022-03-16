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
          <font-awesome-icon icon="exclamation-circle"/>
          Trying to reconnect...
        </span>
      </div>
    </div>
  </header>
  <main class="flex flex-col items-stretch main pb-2">
    <div class="flex h-full">
      <div class="flex-left h-full">
        <Editor
          class="h-full"
          v-model:code="code"
          v-model:lang="lang"
          @upload="upload"
        />
      </div>
      <div class="flex-right h-full flex flex-col">
        <Log :messages="messages" class="bg-white overflow-y-auto flex-1" />
        <Player class="w-full flex-1" />
      </div>
    </div>
  </main>
</template>

<script>
import Editor from "./components/Editor.vue";
import Log from "./components/Log.vue";
import Player from "./components/Player.vue";

export default {
  name: "App",
  components: {
    Editor,
    Log,
    Player,
  },
  data() {
    return {
      code: "",
      lang: "wiring",
      messages: ["Waiting for input..."],
      ws: null,
      websocketReady: false
    };
  },
  methods: {
    establishConnection() {
      this.ws = new WebSocket("ws://localhost:1337");

      this.ws.addEventListener("open", (event) => {
        console.log(this.ws);
        console.log("socket connected");
        this.websocketReady = true
      });

      this.ws.addEventListener("message", (event) => {
        const message = JSON.parse(event.data);
        if (message.type === "log") {
          if (message.stderr) {
            this.messages.push(this.formatMessage(message.stderr));
          }
        }
      });

      this.ws.addEventListener("error", (event) => {
        console.log("socket encountered error");
        this.ws.close();
      });

      this.ws.addEventListener("close", (event) => {
        console.log("socket closed, trying to reconnect");
        this.websocketReady = false
        setTimeout(() => {
          this.establishConnection();
        }, 1000);
      });
    },
    upload() {
      this.ws.send(JSON.stringify({ code: this.code, lang: this.lang }));
    },
    formatMessage(message) {
      const formatted = message.replace(/\n/g, "<br />");
      return formatted;
    },
  },
  created() {
    this.establishConnection();
  }
};
</script>

<style scoped>
.main {
  height: calc(100% - 56px);
}
</style>
