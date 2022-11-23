<template lang="pug">
v-app
  v-container
    #head.fade-in(v-if="display.title")
      .overline Next Up
      .text-h4.text-sm-h3.text-md-h2.text-xl-h1 {{display.title}}
      .text-h6.text-sm-h5.text-md-h4.text-xl-h3 {{display.date}}
      .text-body1.my-4 We run speedrun races every other week! If you're interested in running, <router-link to="/join">here's how to join.</router-link>
      div.mx-n1.mb-3.mt-n1.d-flex.flex-wrap
        v-btn.ma-1(color="primary" href="https://discord.gg/V7caHdC8r3" target="_blank") Aces Wild Discord
        v-btn.ma-1(color="primary" :href="calendarUrl" target="_blank") Race Calendar
        v-btn.ma-1(color="primary" :href="raceData.bingo" target="_blank" :disabled="!raceData.bingo") {{raceData.bingo ? `Viewer Bingo Card!` : `Bingo card isn't ready yet`}}
      .vid.mx-n3.mx-md-0
        div(v-if="isRacingNow")
          iframe(src="https://player.twitch.tv/?channel=raceswild&parent=raceswild.3and3.dev&parent=racing.3and3.dev&parent=raceswild.com&parent=localhost" frameborder="0" allowfullscreen="true" scrolling="no"  width="100%" style="aspect-ratio: 16/9")
        div(v-if="!isRacingNow")
          iframe(src="https://player.twitch.tv/?collection=_5tpY1b8KReJxw&parent=raceswild.3and3.dev&parent=racing.3and3.dev&parent=raceswild.com&parent=localhost&muted=true&autoplay=true" frameborder="0" allowfullscreen="true" scrolling="no" width="100%" style="aspect-ratio: 16/9")
    #history.mt-4.fade-in(v-if="history.length")
      .overline Race History
      v-row
        v-col(cols=12 v-for="race in history")
          v-card(outlined)
            v-card-title(style="word-break: normal")
              .d-flex.justify-space-between.w-100
                span {{race.summary}}
                v-chip.ml-2.flex-shrink-0(color="primary") {{race.date}}
            v-card-text(v-html="race.description")
</template>

<script>
let dayjs = require('dayjs')
let relativeTime = require('dayjs/plugin/relativeTime')

dayjs.extend(relativeTime)

export default {
  name: 'App',
  data: () => ({
    calendarUrl: 'https://calendar.google.com/calendar/embed?src=843820166f86304619f110c549714ea3dabbf2d4dfa75dc233dcca2fa410cf37%40group.calendar.google.com&ctz=America%2FNew_York',
    api: 'https://racing-api.3and3.dev',
    display: {
      title: '',
      date: ''
    },
    isRacingNow: undefined,
    raceData: {},
    history: []
  }),
  computed: {
    vidHeight() {
      return this.$refs.container.clientWidth / 16 * 9
    }
  },
  async created () {
    //next race
    let future = await fetch(`${this.api}/calendar?timeMin=${dayjs().toISOString()}`)
      .then(response => response.json())
      .then(data => data.items)
    if(future.length) {
      this.display.title = future[0].summary
      let date = dayjs(future[0].start.dateTime)
      let relative
      if(date.isAfter(dayjs())){
        relative = date.fromNow()
        this.isRacingNow = false
      } else{
        relative = `right now!`
        this.isRacingNow = false
      }
      this.display.date = `${date.format('dddd, MMM D @ ha')} (${relative})`
    } else {
      this.display.title = 'There are no upcoming races currently scheduled.'
    }

    //current race extra data
    try{
      let current = await fetch('https://racing-events-api.3and3.dev')
        .then(response => response.json())
      this.raceData = current
    } catch(err) {}

    //history
    let past = await fetch(`${this.api}/calendar?timeMax=${dayjs().toISOString()}`)
      .then(response => response.json())
      .then(data => data.items)
    past.reverse()
    this.history = past.map(it => ({
      summary: it.summary,
      description: it.description,
      date: dayjs(it.start.dateTime).format('MMM D')
    }))
  }
};
</script>