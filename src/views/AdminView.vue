<template lang="pug">
v-app
  v-container.admin.fade-in
    .d-flex.justify-start.align-center.flex-wrap
      v-btn.breadcrumb.pa-0(text to="/" color="primary" x-large) Races Wild
      v-icon.mx-2(x-small) mdi-greater-than
      v-btn.breadcrumb.pa-0(text disabled x-large) Admin
    v-divider.mb-4
    v-text-field(
      placeholder="should you be here?"
      outlined
      v-model="secret"
      @change="checkSecret"
      hide-details="auto"
      type="password"
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
      v-tabs
        v-tab Events
        v-tab Players
        v-tab Constants
        v-tab Guides
        v-tab Links
        v-tab-item
          v-row
            v-col(cols=12 md=6 order=2 order-md=1)
              .text-h4.mt-2 Past
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
                    .text-h5 {{item.title}}
            v-col(cols=12 md=6 order=1 order-md=2)
              .text-h4.mt-2 Upcoming
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
                    .text-h5 {{item.title}}
          v-btn(color="primary" @click="openEvent()") Create Event
        v-tab-item
          v-data-table(
            :items="players"
            :headers="playersHeader"
            @click:row="openPlayer"
            sort-by="participations"
            sort-desc=true
          )
          v-btn(color="primary" @click="openPlayer()") Create Player
        v-tab-item
          v-data-table(
            :items="constants"
            :headers="constantsHeader"
            @click:row="openConstant"
            sort-by="slug"
          )
          v-btn(color="primary" @click="openConstant()") Create Constant
        v-tab-item
          v-data-table(
            :items="guides"
            :headers="guidesHeader"
            @click:row="openGuide"
            sort-by="slug"
          )
          v-btn(color="primary" @click="openGuide()") Create Guide
        v-tab-item
          v-row
            v-col(cols=6)
              .text-h5 Copy this
              v-card.pa-2(outlined style="white-space:pre;") {{linksBlock}}
            v-col(cols=6)
              .text-h5 Preview
              v-card.pa-2(outlined v-html="linksMarkdown")
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
              no-resize
              height="300px"
            )
            v-textarea.mb-2(
              v-model="currentEvent.instructions"
              label="Instructions (markdown)"
              outlined
              hide-details
              no-resize
              height="300px"
            )
          v-col(cols=6).d-none.d-sm-block
            v-text-field.mb-2(
              v-model="currentEventWhenViewModel"
              readonly
              outlined
              hide-details
            )
            v-card.md-preview.markdown.pa-2.mb-2(
              v-html="currentEventDescriptionMd"
              outlined
              height="300px"
            )
            v-card.md-preview.markdown.pa-2.mb-2(
              v-html="currentEventInstructionsMd"
              outlined
              height="300px"
            )
          v-col(cols=12)
            v-autocomplete.mb-2(
              v-model="currentEvent.guides"
              label="Attached Guides"
              outlined
              hide-details
              :items="guides"
              item-text="slug"
              item-value="_id"
              multiple
            )
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
        div(v-if="currentEvent._id")
          v-divider.my-2
          .pa-2
            v-card.pa-2(outlined)
              v-btn(:to="`/event/${currentEvent._id}`") Event Permalink
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
          v-col(cols=12)
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
        .pa-2
          v-btn(
            block
            color="primary"
            @click="createOrEditPlayer"
          ) {{currentPlayer && currentPlayer._id ? 'Edit' : 'Create'}} Player
        div(v-if="currentPlayer.short")
          v-divider.my-2
          .pa-2
            v-card.pa-2(outlined)
              v-text-field.mb-2(
                readonly
                hide-details
                label="vdo.ninja push"
                :value="vdoPush(currentPlayer.short)"
              )
              v-text-field.mb-2(
                readonly
                hide-details
                label="vdo.ninja view"
                :value="vdoView(currentPlayer.short)"
              )
    v-dialog(
      v-model="constantDialog"
      fullscreen
      hide-overlay
    )
      v-card(v-if="currentConstant")
        .d-flex.align-center
          .display-1.pa-2 {{currentConstant && currentConstant._id ? 'Edit' : 'Create'}} Constant
          v-spacer
          v-btn(icon x-large @click="constantDialog = false")
            v-icon(x-large) mdi-close
        v-row.pa-2
          v-col(cols=12)
            v-text-field.mb-2(
              v-model="currentConstant.slug"
              label="Slug"
              outlined
              hide-details
              @change="currentConstant.slug = currentConstant.slug.toLowerCase().replaceAll(' ', '-')"
            )
            v-text-field.mb-2(
              v-model="currentConstant.value"
              label="Value"
              outlined
              hide-details
            )
        .pa-2
          v-btn(
            block
            color="primary"
            @click="createOrEditConstant"
          ) {{currentConstant && currentConstant._id ? 'Edit' : 'Create'}} Constant
    v-dialog(
      v-model="guideDialog"
      fullscreen
      hide-overlay
    )
      v-card(v-if="currentGuide")
        .d-flex.align-center
          .display-1.pa-2 {{currentGuide && currentGuide._id ? 'Edit' : 'Create'}} Guide
          v-spacer
          v-btn(icon x-large @click="guideDialog = false")
            v-icon(x-large) mdi-close
        v-row.pa-2
          v-col(cols=12)
            v-text-field.mb-2(
              v-model="currentGuide.slug"
              label="Slug"
              outlined
              hide-details
              @change="currentGuide.slug = currentGuide.slug.toLowerCase().replace(' ', '_')"
            )
            v-text-field.mb-2(
              v-model="currentGuide.title"
              label="Title"
              outlined
              hide-details
            )
          v-col(cols=12 sm=6)
            v-textarea.mb-2(
              v-model="currentGuide.content"
              label="Content (markdown)"
              outlined
              hide-details
              no-resize
              height="300px"
            )
          v-col(cols=6).d-none.d-sm-block
            v-card.md-preview.markdown.pa-2.mb-2(
              v-html="currentGuideContentMd"
              outlined
              height="300px"
            )
        .pa-2
          v-btn(
            block
            color="primary"
            @click="createOrEditGuide"
          ) {{currentGuide && currentGuide._id ? 'Edit' : 'Create'}} Guide
</template>

<script>
let dayjs = require('dayjs')
let markdown = require('markdown').markdown

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
    ],
    constants: [],
    constantDialog: false,
    currentConstant: undefined,
    constantsHeader: [
      {text: 'Slug', value: 'slug', sortable: true},
      {text: 'Value', value: 'value', sortable: true}
    ],
    guides: [],
    guideDialog: false,
    currentGuide: undefined,
    guidesHeader: [
      {text: 'Slug', value: 'slug', sortable: true},
      {text: 'Title', value: 'title', sortable: true}
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
    },
    currentEventDescriptionMd() {
      let it = this.currentEvent.description
      return it ? markdown.toHTML(it) : null
    },
    currentEventInstructionsMd() {
      let it = this.currentEvent.instructions
      return it ? markdown.toHTML(it) : null
    },
    currentGuideContentMd() {
      let it = this.currentGuide.content
      return it ? markdown.toHTML(it) : null
    },
    linksBlock() {
      let block = '## vdo.ninja links\n'
      let commentaryRoomLink = this.constants.find(it => it.slug == 'commentary-room-link')
      if(commentaryRoomLink){
        block += `[Commentary Room](${commentaryRoomLink.value})\n`
      }
      block += '### Player Links\n'
      block += JSON.parse(JSON.stringify(this.players))
        .sort((a, b) => {
          const A = (a.discord || a.short).toUpperCase()
          const B = (b.discord || b.short).toUpperCase()
          if(A<B) return -1
          if(A>B) return 1
          return 0
        })
        .map(it => ` - [${it.discord || it.short}](${this.vdoPush(it.short)})`)
        .join('\n')
      return block
    },
    linksMarkdown() {
      return markdown.toHTML(this.linksBlock)
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
    vdoPush(short) {
      let s = encodeURIComponent(short.toLowerCase())
      return `https://vdo.ninja/?s&push=raceswild${s}`
    },
    vdoView(short) {
      let s = encodeURIComponent(short.toLowerCase())
      return `https://vdo.ninja/?view=raceswild${s}`
    },
    openEvent(item){
      this.eventDialog = true
      this.currentEvent = item ? JSON.parse(JSON.stringify(item)) : {}
      if(!this.currentEvent.links)
        this.currentEvent.links = {}
      if(!this.currentEvent.when)
        this.currentEvent.when = 0
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
    openPlayer(item){
      this.playerDialog = true
      this.currentPlayer = item ? JSON.parse(JSON.stringify(item)) : {}
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
    openConstant(item){
      this.constantDialog = true
      this.currentConstant = item ? JSON.parse(JSON.stringify(item)) : {}
    },
    createOrEditConstant(){
      if(this.loading || !this.currentConstant.slug)
        return
      this.loading = true
      let url
      if(this.currentConstant._id)
        url = `${this.api}/update_constant?secret=${this.secret}&id=${this.currentConstant._id}`
      else
        url = `${this.api}/insert_constant?secret=${this.secret}`
      let copy = JSON.parse(JSON.stringify(this.currentConstant))
      delete copy._id
      return fetch(url, {
        method: 'POST',
        body: JSON.stringify(copy)
      }).then(() => {
        this.currentConstant = undefined
        this.constantDialog = false
        return this.init()
      })
    },
    openGuide(item){
      this.guideDialog = true
      this.currentGuide = item ? JSON.parse(JSON.stringify(item)) : {}
    },
    createOrEditGuide(){
      if(this.loading || !this.currentGuide.slug)
        return
      this.loading = true
      let url
      if(this.currentGuide._id)
        url = `${this.api}/update_guide?secret=${this.secret}&id=${this.currentGuide._id}`
      else
        url = `${this.api}/insert_guide?secret=${this.secret}`
      let copy = JSON.parse(JSON.stringify(this.currentGuide))
      delete copy._id
      return fetch(url, {
        method: 'POST',
        body: JSON.stringify(copy)
      }).then(() => {
        this.currentGuide = undefined
        this.guideDialog = false
        return this.init()
      })
    },
    async init() {
      this.loading = true
      this.upcomingEvents = await fetch(`${this.api}/upcoming_events`)
        .then(data => data.json())
        .then(json => json.result)
      this.pastEvents = await fetch(`${this.api}/past_events`)
        .then(data => data.json())
        .then(json => json.result)
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
        return b.participations - a.participations
      })
      this.players = players
      this.constants = await fetch(`${this.api}/constants`)
        .then(data => data.json())
        .then(json => json.result)
      this.guides = await fetch(`${this.api}/guides`)
        .then(data => data.json())
        .then(json => json.result)
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

<style>
.md-preview {
  overflow: scroll;
}
</style>