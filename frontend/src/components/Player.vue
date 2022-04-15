<template>
  <div class="flex flex-col">
    <div ref="twitchVideo" />
  </div>
</template>

<script>
export default {
  name: 'Player',
  data () {
    return {
      player: null,
      streamWidth: 1280,
      streamHeight: 720,
      windowWidth: 0,
      windowHeight: 0
    }
  },
  computed: {
    sizeCoef () {
      if (this.windowWidth < 600) {
        return 0.25
      } else if (this.windowWidth < 900) {
        return 0.3
      } else if (this.windowWidth < 1200) {
        return 0.4
      } else if (this.windowWidth < 1500) {
        return 0.5
      } else return 0.65
    },
    options () {
      return {
        width: this.streamWidth * this.sizeCoef,
        height: this.streamHeight * this.sizeCoef,
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
    this.windowHeight = window.innerHeight
    this.windowWidth = window.innerWidth
    this.startStream()
  }
}
</script>

<style scoped>
</style>
