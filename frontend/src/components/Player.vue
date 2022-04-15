<template>
  <div class="flex flex-col">
    <!-- <p class="bg-gray-700 text-white text-center flex-0">Arduino Webcam</p> -->
    <div ref="twitchVideo" />
  </div>
</template>

<script>
export default {
  name: 'Player',
  data () {
    return {
      player: null
    }
  },
  computed: {
    options () {
      return {
        channel: 'arduinowebcam',
        parent: ['localhost', 'sudety.ch', 'www.sudety.ch']
      }
    }
  },
  methods: {
    startStream () {
      this.$loadScript('twitch.js')
        .then(() => {
          this.player = new window.Twitch.Player(
            this.$refs.twitchVideo,
            this.options
          )
          this.player.setVolume(1)
          console.log(this.player)
        })
        .catch(() => {
          console.log('failed to load twitch script')
        })
    }
  },
  mounted () {
    this.startStream()
  }
}
</script>

<style scoped>
</style>
