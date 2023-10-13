<template lang="pug">
v-app
  v-container.face-in(v-if="readiness" style="max-width:600px")
    #head
      v-hover(v-slot="{hover}")
        v-card.pa-2(flat to="/next" :style="hover ? 'background-color:#E3F2FD;' : ''")
          .overline Next Up
          .text-h4.text-sm-h3.text-md-h2 {{event.title || 'TBD'}}
          .text-h6.text-sm-h5.text-md-h4(v-if="event")
            span {{formattedDate}}
            span(v-if="isNow") &nbsp;(
              a(href="https://twitch.tv/raceswild") right now!
              | )
            span(v-else) &nbsp;({{relativeDate}})
      div.mt-4.d-flex.flex-column
        v-btn.d-flex.justify-start(color="primary" text x-large href="https://twitch.tv/raceswild" target="_blank").pa-2
          img.mr-2(src="TwitchGlitchPurple.svg" width="50px")
          | twitch.tv/raceswild
        v-btn.d-flex.justify-start(color="primary" text x-large href="https://www.youtube.com/@raceswild" target="_blank" height="50px").pa-2
          img.mr-1(src="youtube.svg" width="60px" style="margin:-5px")
          | youtube.com/@raceswild
        v-btn.d-flex.justify-start(color="primary" text x-large href="https://discord.gg/V7caHdC8r3" target="_blank").pa-2
          img.mr-2(src="discord-mark-blue.svg" width="50px")
          | aces wild server
      .text-body1.my-4.fade-in(v-if="readiness>1" v-html="blurb")
    #body(v-if="readiness>2")
      v-divider.my-4
      v-tabs
        v-tab.ml-4 Upcoming
        v-tab Archive
        v-tab Players
        v-tab-item
          v-data-iterator.mt-2(
            :items="upcomingEvents"
            item-key="_id"
            :items-per-page="5"
          )
            template(v-slot:default="{items}")
              v-card.pa-2.ma-4(
                v-for="item in items"
                :key="item._id"
                outlined
                :to="`/event/${item._id}`"
                hover
              )
                .overline {{format(item.when)}}
                .text-h5 {{item.title}}
        v-tab-item
          v-data-iterator.mt-2(
            :items="pastEvents"
            item-key="_id"
            :items-per-page="5"
          )
            template(v-slot:default="{items}")
              v-card.pa-2.ma-4(
                v-for="item in items"
                :key="item._id"
                outlined
                :to="`/event/${item._id}`"
                hover
              )
                .overline {{format(item.when)}}
                .text-h5 {{item.title}}
        v-tab-item
          v-data-table.mt-2(
            :items="players"
            :headers="playersHeader"
            sort-by="participations"
            sort-desc=true
          )
            template(v-slot:item.short="{item}")
              router-link(:to="`/player/${item.short}`") {{item.short}}
</template>

<script>
let dayjs = require('dayjs')
let relativeTime = require('dayjs/plugin/relativeTime')
let markdown = require('markdown').markdown

dayjs.extend(relativeTime)

export default {
  data: () => ({
    readiness: 0,
    api: 'https://data.mongodb-api.com/app/data-bayhy/endpoint/rw',
    blurb: '',
    upcomingEvents: [],
    pastEvents: [],
    players: [],
    playersHeader: [
      {text: 'Name', value: 'short', sortable: true},
      {text: 'Participations', value: 'participations', sortable: true},
      {text: 'Wins', value: 'wins', sortable: true}
    ]
  }),
  computed: {
    event() {
      return this.upcomingEvents[0]
    },
    formattedDate() {
      if(!(this.event && this.event.when))
        return null
      return this.format(this.event.when)
    },
    relativeDate() {
      if(!(this.event && this.event.when))
        return null
      let d = dayjs.unix(this.event.when)
      return d.fromNow()
    },
    isPast() {
      if(!(this.event && this.event.when))
        return null
      let d = dayjs.unix(this.event.when)
      return d.isBefore(dayjs())
    },
    isFuture() {
      if(!(this.event && this.event.when))
        return null
      let d = dayjs.unix(this.event.when)
      return d.isAfter(dayjs().add(6, 'h'))
    },
    isNow() {
      return !this.isPast && !this.isFuture
    }
  },
  methods: {
    format(when) {
      let d = dayjs.unix(when)
      let format = 'dddd, MMM D'
      if(dayjs().year() != d.year())
        format += ', YYYY'
      format += ' @ h'
      if(d.minute())
        format += ':mm'
      format += 'a'
      return d.isValid() ? d.format(format) : null
    },
    async init() {
      this.readiness = 0
      this.upcomingEvents = await fetch(`${this.api}/upcoming_events`)
        .then(data => data.json())
      this.readiness++
      this.blurb = await fetch(`${this.api}/constant?slug=home-blurb`)
        .then(data => data.json())
        .then(json => markdown.toHTML(json.value))
      this.readiness++
      let pastEvents = await fetch(`${this.api}/past_events`)
        .then(data => data.json())
      let players = await fetch(`${this.api}/players`)
        .then(data => data.json())
      players.forEach(player => {
        player.participations = 0
        player.wins = 0
        pastEvents.forEach(event => {
          if(event.participants.includes(player._id))
            player.participations++
          if(event.winners.includes(player._id))
            player.wins++
        })
      })
      players.sort((a, b) => {
        return b.participations - a.participations
      })
      this.players = players
      this.pastEvents = pastEvents
      this.readiness++
    }
  },
  mounted() {
    this.init()
  }
};
</script>