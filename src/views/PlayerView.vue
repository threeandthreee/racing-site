<template lang="pug">
v-app
  v-container.player.fade-in
    .d-flex.justify-start.align-center.flex-wrap
      v-btn.breadcrumb.pa-0(text to="/" color="primary" x-large) Races Wild
      v-icon.mx-2(x-small) mdi-greater-than
      v-btn.breadcrumb.pa-0(text to="/" color="primary" x-large) Players
      v-icon.mx-2.fade-in(x-small v-if="ready") mdi-greater-than
      v-btn.breadcrumb.pa-0.fade-in(text disabled x-large v-if="ready") {{player ? player.short : '404'}}
    v-divider.mb-4
    div(v-if="ready")
      div(v-if="!player")
        p Player not found.
      div(v-else)
        .d-flex.flex-column
          v-btn.d-flex.justify-start(text x-large v-if="player.discord")
            img(src="/discord-mark-blue.svg" height="30px")
            .ml-4 @{{player.discord}}
          v-btn.d-flex.justify-start(text x-large color="primary" v-if="player.twitch" :href="`https://twitch.tv/${player.twitch}`")
            img.ml-1(src="/TwitchGlitchPurple.svg" height="40px")
            .ml-4 twitch.tv/{{player.twitch}}
          v-btn.d-flex.justify-start(text x-large color="primary" v-if="player.youtube" :href="`https://youtube.com/@${player.youtube}`")
            img.ml-n1(src="/youtube.svg" height="50px")
            .ml-2 youtube.com/@{{player.youtube}}
</template>

<script>
export default {
  data: () => ({
    ready: false,
    api: 'https://data.mongodb-api.com/app/data-bayhy/endpoint/rw',
    player: undefined
  }),
  methods: {
    async init() {
      this.ready = false
      let short = encodeURIComponent(this.$route.params.short)
      this.player = await fetch(`${this.api}/player?short=${short}`)
        .then(data => data.json())
      console.log(this.player)
      this.ready = true
    }
  },
  mounted() {
    this.init()
  },
  watch: {
    '$route.params.slug': function() {
      this.init()
    }
  }
}
</script>