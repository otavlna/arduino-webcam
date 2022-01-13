<template>
<div class="flex flex-col">
  <!-- <p class="bg-gray-700 text-white text-center flex-0">Arduino Webcam</p> -->
  <div ref="twitchVideo" class="flex-1" />
</div>
</template>

<script>
export default {
  name: 'Player',
  data () {
    return { player: null }
  },
  mounted () {
    const options = {
      width: '100%',
      height: '100%',
      channel: 'streamerhouse'
    }
    this.$loadScript('twitch.js')
      .then(() => {
        // you might need to pass an ID string as a first argument..
        this.player = new window.Twitch.Player(this.$refs.twitchVideo, options)
        this.player.setVolume(1)
        console.log(this.player)
      })
      .catch(() => {
        console.log('failed to load script')
      })
  }
}
</script>

<style scoped>

</style>
