<template lang="pug">
v-app
  v-container.bingo.fade-in(v-if="ready")
    div(style="max-width: 500px")
      .d-flex.justify-start.align-center.flex-wrap
        v-btn.breadcrumb.pa-0(text to="/" color="primary" x-large) Races Wild
        v-icon.mx-2(x-small) mdi-greater-than
        v-btn.breadcrumb.pa-0(text disabled x-large) Bingo
      p Play bingo while you watch the race! If these squares don't make sense to you, don't worry -- we'll call them out as they happen. Or ask in chat!
      v-card.mb-4(outlined v-if="bingo")
        iframe(width="100%" frameborder="0" style="aspect-ratio:1" :src="bingo")
      p(v-else) Something went wrong, can't find bingo card...
      v-switch(label="Show Stream" v-model="showVideo")
      v-card.mb-4(outlined v-if="showVideo")
        iframe(src="https://player.twitch.tv/?channel=raceswild&parent=raceswild.3and3.dev&parent=racing.3and3.dev&parent=raceswild.com&parent=localhost" frameborder="0" allowfullscreen="true" scrolling="no"  width="100%" style="aspect-ratio: 16/9")
      v-switch(label="Show Chat" v-model="showChat")
      v-card.mb-4(outlined v-if="showChat")
        iframe(src="https://www.twitch.tv/embed/raceswild/chat?parent=raceswild.3and3.dev&parent=racing.3and3.dev&parent=raceswild.com&parent=localhost" frameborder="0" allowfullscreen="true" scrolling="no"  width="100%" height="300px")
</template>

<script>
export default {
  data: () => ({
    ready: false,
    api: 'https://data.mongodb-api.com/app/data-bayhy/endpoint/rw',
    bingo: undefined,
    showVideo: false,
    showChat: false
  }),
  methods: {
    async init() {
      this.ready = false
      let nextEvent = await fetch(`${this.api}/next_event?offset=-12`)
        .then(data => data.json())
        .then(json => json.result)
      if(nextEvent.links.bingo)
        this.bingo = nextEvent.links.bingo
      else
        this.bingo = await fetch(`${this.api}/constant?slug=bingo`)
          .then(data => data.json())
          .then(json => json.result.value)
      this.ready = true
    }
  },
  mounted() {
    this.init()
  }
}
</script>