<template lang="pug">
v-app
  v-container
    #head.fade-in(v-if="display.title")
      .overline Next Up
      .text-h4.text-sm-h3.text-md-h2.text-xl-h1 {{display.title}}
      .text-h6.text-sm-h5.text-md-h4.text-xl-h3 {{display.date}}
      .text-body1.my-4 Speedrun races every other week!
      div.mx-n1.mb-3.mt-n1.d-flex.flex-wrap.align-center
        v-btn(tile icon x-large href="https://twitch.tv/raceswild" target="_blank").pa-2
          img(src="TwitchGlitchPurple.svg")
        v-btn(tile icon x-large href="https://www.youtube.com/@raceswild" target="_blank").pa-2
          img(src="youtube.svg")
        v-btn(tile icon x-large href="https://discord.gg/V7caHdC8r3" target="_blank").pa-2
          img(src="discord-mark-blue.svg")
        v-btn(tile icon x-large :href="calendarUrl" target="_blank").pa-2
          img(src="Google_Calendar_icon_(2020).svg")
      v-btn(color="primary" outlined to="/bingo") Viewer Bingo
    #history.mt-8.fade-in(v-if="history.length")
      .overline Race History
      v-data-iterator(
        :items="history"
        item-key="id"
        :items-per-page="5"
      )
        template(v-slot:default="{ items }")
          v-row.ma-0.pa-0
            v-col.px-0.py-1(cols=12 v-for="race in items" :key="race.id")
              v-card(outlined)
                v-card-title(style="word-break: normal").pb-1
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
    history: []
  }),
  computed: {
    vidHeight() {
      return this.$refs.container.clientWidth / 16 * 9
    }
  },
  async created () {
    //next race
    let future = await fetch(`${this.api}/calendar/next`)
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