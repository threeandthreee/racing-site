<template lang="pug">
v-app
  v-container.event.fade-in
    .d-flex.justify-start.align-center.flex-wrap
      v-btn.breadcrumb.pa-0(text to="/" color="primary" x-large) Races Wild
      v-icon.mx-2(x-small) mdi-greater-than
      v-btn.breadcrumb.pa-0(text disabled x-large) Event
    v-divider.mb-4
    div(v-if="ready")
      .text-h4.text-sm-h3.text-md-h2.text-xl-h1 {{event.title}}
      .d-flex.flex-wrap
        .text-h6.text-sm-h5.text-md-h4.text-xl-h3 {{formattedDate}}
          span(v-if="!isPast") &nbsp;(
          span(v-if="isFuture") {{relativeDate}} on&nbsp;
            a(href="https://twitch.tv/raceswild") twitch
          span(v-else-if="isNow")
            a(href="https://twitch.tv/raceswild") right now!
          span(v-if="!isPast") )
      .body-1.mt-4(v-if="event.description" v-html="event.description_md")
      div(v-if="isPast")
        div(v-if="event.links")
          v-divider.my-4
          .d-flex.flex-column
            v-btn.d-flex.justify-start(text x-large color="primary" :href="event.links.youtube" v-if="event.links.youtube")
              img.ml-n1(src="/youtube.svg" height="50px")
              .ml-2 Youtube VOD
            v-btn.d-flex.justify-start(text x-large color="primary" :href="event.links.twitch" v-if="event.links.twitch")
              img.ml-1(src="/TwitchGlitchPurple.svg" height="40px")
              .ml-4 Twitch VOD
            v-btn.d-flex.justify-start(text x-large color="primary" :href="event.links.racetime" v-if="event.links.racetime")
              img(src="/racetimeGG-favicon-512x512.png" height="40px")
              .ml-4 Racetime Room
      div(v-if="event.participants")
        v-divider.my-4
        .text-h5.mb-1 {{!isPast ? 'Expected ' : ''}}Participants
        v-chip.ma-1(
          v-for="player in event.players"
          color="primary"
          outlined
          :to="`/player/${encodeURIComponent(player.short)}`"
        ) {{player.short}}
      div(v-if="!isPast && event.instructions")
        v-divider.mt-4.mb-2
        v-divider.mt-2.mb-8
        v-divider.mt-8.mb-2
        v-divider.mt-2.mb-4
        #instructions.text-h4.text-sm-h3.mb-2 Participant Instructions
        .body-1.markdown(v-html="event.instructions_md")
        div(v-if="event.guides")
          v-divider.my-4
          .text-h4.mb-2 Relevant Guides
          v-card.pa-2.mb-4(outlined v-for="guide in event.guides" :id="guide.slug")
            .text-h5 {{guide.title}}
            .body-1.markdown(v-html="guide.content_md")
</template>

<script>
let dayjs = require('dayjs')
let relativeTime = require('dayjs/plugin/relativeTime')
let markdown = require('markdown').markdown

dayjs.extend(relativeTime)

export default {
  data: () => ({
    ready: false,
    api: 'https://data.mongodb-api.com/app/data-bayhy/endpoint/rw',
    event: undefined
  }),
  computed: {
    formattedDate() {
      if(!(this.event && this.event.when))
        return null
      let d = dayjs.unix(this.event.when)
      let format = 'dddd, MMM D'
      if(dayjs().year() != d.year())
        format += ', YYYY'
      format += ' @ h'
      if(d.minute())
        format += ':mm'
      format += 'a'
      return d.isValid() ? d.format(format) : null
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
    async init() {
      this.ready = false
      let id = this.$route.params && this.$route.params.id
      let guides = await fetch(`${this.api}/guides`)
        .then(data => data.json())
      let event
      if(id)
        event = await fetch(`${this.api}/event?id=${id}`)
          .then(data => data.json())
      else
        event = await fetch(`${this.api}/next_event?offset=-6`)
          .then(data => data.json())
      ;['description', 'instructions'].forEach(item => {
        if(event[item])
          event[item + '_md'] = markdown.toHTML(event[item])
      })
      if(event.guides){
        event.guides = event.guides.map(id => guides.find(it => id == it._id))
        event.guides.forEach(guide => {
          guide.content_md = markdown.toHTML(guide.content)
        })
      }
      if(event.participants){
        let players = await fetch(`${this.api}/players`)
          .then(data => data.json())
        if(players)
          event.players = event.participants
            .map(it => players.find(that => that._id == it))
            .filter(it => it)
            .sort((a, b) => {
              const A = a.short.toUpperCase()
              const B = b.short.toUpperCase()
              if(A<B) return -1
              if(A>B) return 1
              return 0
            })
      }
      this.event = event
      this.ready = true
    }
  },
  mounted() {
    this.init()
  },
  watch: {
    '$route.params.id': function() {
      this.init()
    }
  }
}
</script>