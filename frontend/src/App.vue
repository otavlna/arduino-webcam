<template>
  <header class="bg-white py-4">
    <div class="lg:mx-20 mx-5">
      <h1>Arduino Webcam</h1>
    </div>
  </header>
  <main class="max-w-7xl mx-auto mt-5">
    <div class="flex space-x-10 h-80">
      <Editor class="flex-editor" v-model:code="code" />
      <Log :messages="messages" class="bg-white overflow-y-auto flex-1" />
    </div>
  </main>
</template>

<script>
import Editor from './components/Editor.vue'
import Log from './components/Log.vue'

export default {
  name: 'App',
  components: {
    Editor,
    Log
  },
  data () {
    return {
      code: '',
      messages: ['ahoj', 'ahoj2', 'ahoj3']
    }
  }
}
</script>
