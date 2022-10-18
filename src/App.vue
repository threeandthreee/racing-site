<template lang="pug">
v-app
  v-container
    #head.fade-in(v-if="display.title")
      .overline Next Race
      .text-h4.text-sm-h3.text-md-h2.text-xl-h1 {{display.title}}
      .text-h6.text-sm-h5.text-md-h4.text-xl-h3 {{display.date}}
      .text-body1.mt-4 We try to race every other week.
      .text-body1 You can subscribe to our race calendar <a :href="calendarUrl">here</a>, and use <a :href="multitwitchUrl">this link</a> to watch all the streams at once on race day!
    #racers.mt-12.fade-in(v-if="runners[0].login")
      .overline The Racers
      v-row
        v-col(cols=12 md=6 v-for="runner in runners")
          v-card(outlined :href="`https://twitch.tv/${runner.display_name}`" hover).d-flex.align-center
            v-img(:src="runner.profile_image_url" max-width=80 max-height=80 style="width:80px; height:80px; border-radius:50%").ma-2
            .text-h5.ml-2 {{runner.display_name}}
    #history.mt-12.fade-in(v-if="history.length")
      .overline Race History
      v-row
        v-col(cols=12 v-for="race in history")
          v-card(outlined)
            v-card-title [{{race.date}}] {{race.summary}}
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
    runners: [{display_name:'acebreakerultra'}, {display_name:'metatr0n7'}, {display_name:'ososhawkin'}, {display_name:'threeandthree'}],
    api: 'https://racing-api.3and3.dev',
    display: {
      title: '',
      date: ''
    },
    history: []
  }),
  computed: {
    multitwitchUrl() {
      return `https://kadgar.net/live/${this.runners.map(it => it.display_name).join('/')}`
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
      let relative = date.isAfter(dayjs()) ? date.fromNow() : `right now!`
      this.display.date = `${date.format('dddd, MMM D @ ha')} (${relative})`
    } else {
      this.display.title = 'There are no upcoming races currently scheduled.'
    }

    //runners
    this.runners = await fetch(`${this.api}/twitch?${this.runners.map(it => `login=${it.display_name}`).join('&')}`)
      .then(response => response.json())
      .then(data => data.data)
    this.runners.sort((a, b) => {
      let A = a.display_name.toUpperCase()
      let B = b.display_name.toUpperCase()
      if(A<B) return -1
      if(A>B) return 1
      return 0
    })

    //history
    let past = await fetch(`${this.api}/calendar?timeMax=${dayjs().toISOString()}`)
      .then(response => response.json())
      .then(data => data.items)
    past.reverse()
    this.history = past.map(it => ({
      summary: it.summary,
      description: it.description.replaceAll(' | ', '<br/>'),
      date: dayjs(it.start.dateTime).format('MMM D')
    }))
  }
};
</script>

<style>
.fade-in {
  animation: fadeIn 1s;
}
@keyframes fadeIn {
  0% { opacity: 0; }
  100% { opacity: 1; }
}
</style>