<template lang="pug">
v-app
  v-container.admin.fade-in
    .d-flex.justify-start.align-center.flex-wrap
      v-btn.pa-0(text to="/" color="primary" x-large) Races Wild
      v-icon.mx-2(x-small) mdi-greater-than
      v-btn.pa-0(text disabled x-large) Admin
    v-divider.mb-4
    v-text-field(
      placeholder="should you be here?"
      outlined
      v-model="secret"
      @change="checkSecret"
      hide-details="auto"
    )
    .my-2.d-flex.flex-column.align-start
      v-btn(
        text
        href="https://www.twitch.tv/moderator/raceswild"
        target="_blank"
        color="primary"
      ) Races Wild Mod View
      v-btn(
        text
        href="https://dashboard.twitch.tv/u/raceswild/stream-manager"
        target="_blank"
        color="primary"
      ) Creator Dashboard
    div.fade-in(v-if="isAuthed")
      v-divider.my-4
      .d-flex
        .display-1 Events
        v-spacer
        v-btn(
          color="primary"
          @click="openEvent()"
        ) Create Event
      v-row
        v-col(cols=12 md=6)
          h2 Past
          v-data-iterator(
            :items="pastEvents"
            item-key="_id"
            :items-per-page="5"
          )
            template(v-slot:default="{items}")
              v-card.pa-2.mb-2(
                v-for="item in items"
                :key="item._id"
                outlined
                @click="openEvent(item)"
              )
                .d-flex
                  .overline {{format(item.when)}}
                  v-spacer
                  v-icon(
                    color="red"
                    v-if="!(item.title && item.description && item.participants && item.winners && item.links.twitch && item.links.youtube)"
                  ) mdi-wrench
                h3 {{item.title}}
        v-col(cols=12 md=6)
          h2 Upcoming
          v-data-iterator(
            :items="upcomingEvents"
            item-key="_id"
            :items-per-page="5"
          )
            template(v-slot:default="{items}")
              v-card.pa-2.mb-2(
                v-for="item in items"
                :key="item._id"
                outlined
                @click="openEvent(item)"
              )
                .d-flex
                  .overline {{format(item.when)}}
                  v-spacer
                  v-icon(
                    color="red"
                    v-if="!(item.title && item.description && item.instructions)"
                  ) mdi-wrench
                h3 {{item.title}}
      v-divider.my-4
      .d-flex
        .display-1 Players
        v-spacer
        v-btn(
          color="primary"
          @click="openPlayer()"
        ) Create Player
      v-row
        v-col(cols=12)
          v-data-table(
            :items="players"
            :headers="playersHeader"
            @click:row="openPlayer"
            sort-by="participations"
            sort-desc=true
          )
    v-dialog(
      v-model="eventDialog"
      fullscreen
      hide-overlay
    )
      v-card(v-if="currentEvent")
        .d-flex.align-center
          .display-1.pa-2 {{currentEvent && currentEvent._id ? 'Edit' : 'Create'}} Event
          v-spacer
          v-btn(icon x-large @click="eventDialog = false")
            v-icon(x-large) mdi-close
        v-row.pa-2
          v-col(cols=12)
            v-text-field.mb-2(
              v-model="currentEvent.title"
              label="Title"
              outlined
              hide-details
            )
          v-col(cols=12 sm=6)
            v-text-field.mb-2(
              v-model="currentEventWhenEditModel"
              label="When (ex. 2023-09-14T21:00:00)"
              outlined
              hide-details
              @focus="whenFocus=true"
              @blur="whenFocus=false"
            )
            v-textarea.mb-2(
              v-model="currentEvent.description"
              label="Description (markdown)"
              outlined
              hide-details
            )
            v-textarea.mb-2(
              v-model="currentEvent.instructions"
              label="Instructions (markdown)"
              outlined
              hide-details
            )
          v-col(cols=6).d-none.d-sm-block
            v-text-field.mb-2(
              v-model="currentEventWhenViewModel"
              readonly
              outlined
              hide-details
            )
            v-textarea.mb-2(
              v-model="currentEvent.description"
              readonly
              outlined
              hide-details
            )
            v-textarea.mb-2(
              v-model="currentEvent.instructions"
              readonly
              outlined
              hide-details
            )
          v-col(cols=12)
            v-autocomplete.mb-2(
              v-model="currentEvent.participants"
              label="Participants"
              outlined
              hide-details
              :items="players"
              item-text="short"
              item-value="_id"
              multiple
            )
            v-autocomplete.mb-2(
              v-model="currentEvent.winners"
              label="Winners"
              outlined
              hide-details
              :items="players"
              item-text="short"
              item-value="_id"
              multiple
            )
          v-col(cols=12)
            .overline Links
            v-text-field.mb-2(
              v-model="currentEvent.links.bingo"
              label="Bingo"
              outlined
              hide-details
            )
            v-text-field.mb-2(
              v-model="currentEvent.links.racetime"
              label="Racetime"
              outlined
              hide-details
            )
            v-text-field.mb-2(
              v-model="currentEvent.links.twitch"
              label="Twitch VOD"
              outlined
              hide-details
            )
            v-text-field.mb-2(
              v-model="currentEvent.links.youtube"
              label="Youtube"
              outlined
              hide-details
            )
        .pa-2
          v-btn(
            block
            color="primary"
            @click="createOrEditEvent"
          ) {{currentEvent && currentEvent._id ? 'Edit' : 'Create'}} Event
    v-dialog(
      v-model="playerDialog"
      fullscreen
      hide-overlay
    )
      v-card(v-if="currentPlayer")
        .d-flex.align-center
          .display-1.pa-2 {{currentPlayer && currentPlayer._id ? 'Edit' : 'Create'}} Player
          v-spacer
          v-btn(icon x-large @click="playerDialog = false")
            v-icon(x-large) mdi-close
        v-row.pa-2
          v-col(cols=12 sm=6)
            v-text-field.mb-2(
              v-model="currentPlayer.short"
              label="Short"
              outlined
              hide-details
            )
            v-text-field.mb-2(
              v-model="currentPlayer.discord"
              label="Discord"
              outlined
              hide-details
            )
            v-text-field.mb-2(
              v-model="currentPlayer.twitch"
              label="Twitch"
              outlined
              hide-details
            )
            v-text-field.mb-2(
              v-model="currentPlayer.youtube"
              label="Youtube"
              outlined
              hide-details
            )
          v-col(cols=6).d-none.d-sm-block
        .pa-2
          v-btn(
            block
            color="primary"
            @click="createOrEditPlayer"
          ) {{currentPlayer && currentPlayer._id ? 'Edit' : 'Create'}} Player
</template>

<script>
let dayjs = require('dayjs')

export default {
  data: () => ({
    refreshKey: 0,
    loading: false,
    api: 'https://data.mongodb-api.com/app/data-bayhy/endpoint/rw',
    secret: undefined,
    isAuthed: false,
    upcomingEvents: [],
    pastEvents: [],
    eventDialog: false,
    currentEvent: undefined,
    whenFocus: false,
    players: [],
    playerDialog: false,
    currentPlayer: undefined,
    playersHeader: [
      {text: 'Short', value: 'short', sortable: true},
      {text: 'Discord', value: 'discord', sortable: true},
      {text: 'Twitch', value: 'twitch', sortable: true},
      {text: 'Youtube', value: 'youtube', sortable: true},
      {text: 'Participations', value: 'participations', sortable: true},
      {text: 'Wins', value: 'wins', sortable: true}
    ]
  }),
  computed: {
    currentEventWhenEditModel: {
      get() {
        if(this.whenFocus)
          return undefined
        let d = dayjs.unix(this.currentEvent.when)
        return d.isValid() ? d.format('YYYY-MM-DDTHH:mm:ss') : null
      },
      set: function(it) {
        let d = dayjs(it)
        this.currentEvent.when = d.isValid() ? d.unix() : null
        this.refreshKey++
      }
    },
    currentEventWhenViewModel: {
      get() {
        this.refreshKey
        if(!this.currentEvent.when)
          return null
        let d = dayjs.unix(this.currentEvent.when)
        return d.isValid() ? d.format('dddd, MMM D YYYY @ ha') : null
      }
    }
  },
  methods: {
    async checkSecret() {
      let resp = await fetch(`${this.api}/check?secret=${this.secret}`)
      this.isAuthed = resp.ok
    },
    format(it, format='dddd, MMM D @ ha') {
      return dayjs.unix(it).format(format)
    },
    openEvent(item){
      this.eventDialog = true
      this.currentEvent = item ? JSON.parse(JSON.stringify(item)) : {}
      if(!this.currentEvent.links)
        this.currentEvent.links = {}
      if(!this.currentEvent.when)
        this.currentEvent.when = 0
    },
    openPlayer(item){
      this.playerDialog = true
      this.currentPlayer = item ? JSON.parse(JSON.stringify(item)) : {}
    },
    createOrEditEvent(){
      if(this.loading || !this.currentEvent.when)
        return
      this.loading = true
      let url
      if(this.currentEvent._id)
        url = `${this.api}/update_event?secret=${this.secret}&id=${this.currentEvent._id}`
      else
        url = `${this.api}/insert_event?secret=${this.secret}`
      let copy = JSON.parse(JSON.stringify(this.currentEvent))
      delete copy._id
      return fetch(url, {
        method: 'POST',
        body: JSON.stringify(copy)
      }).then(() => {
        this.currentEvent = undefined
        this.eventDialog = false
        return this.init()
      })
    },
    createOrEditPlayer(){
      if(this.loading || !this.currentPlayer.short)
        return
      this.loading = true
      let url
      if(this.currentPlayer._id)
        url = `${this.api}/update_player?secret=${this.secret}&id=${this.currentPlayer._id}`
      else
        url = `${this.api}/insert_player?secret=${this.secret}`
      let copy = JSON.parse(JSON.stringify(this.currentPlayer))
      delete copy._id
      return fetch(url, {
        method: 'POST',
        body: JSON.stringify(copy)
      }).then(() => {
        this.currentPlayer = undefined
        this.playerDialog = false
        return this.init()
      })
    },
    async init() {
      this.loading = true
      await fetch(`${this.api}/upcoming_events`)
        .then(data => data.json())
        .then(json => this.upcomingEvents = json.result)
      await fetch(`${this.api}/past_events`)
        .then(data => data.json())
        .then(json => this.pastEvents = json.result)
      let players = await fetch(`${this.api}/players`)
        .then(data => data.json())
        .then(json => json.result)
      players.forEach(player => {
        player.participations = 0
        player.wins = 0
        this.pastEvents.forEach(event => {
          if(event.participants.includes(player._id))
            player.participations++
          if(event.winners.includes(player._id))
            player.wins++
        })
      })
      players.sort((a, b) => {
        return a.participations - b.participations
      })
      this.players = players
      this.loading = false
    }
  },
  watch: {
    isAuthed(val) {
      if(val) {
        this.init()
      }
    }
  }
}
</script>
