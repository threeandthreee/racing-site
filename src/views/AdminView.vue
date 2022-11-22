<template lang="pug">
v-app
  v-container.admin.fade-in
    .d-flex.justify-start.align-center.flex-wrap
      v-btn.pa-0(text to="/" color="primary" x-large) Races Wild
      v-icon.mx-4 mdi-greater-than
      v-btn.pa-0(text disabled x-large) Admin
    .text-h4 Links for current/upcoming race:
    v-card.my-8(outlined)
      v-card-text
        v-text-field.my-4(v-for="(val, key) of raceData" v-if="key != '_id'" :label="key" :value="val" readonly hide-details="auto")
        span(v-if="Object.keys(raceData).length<=1") No links set yet.

    p These can be modified with nightbot commands in the <a href="https://twitch.tv/raceswild" target="_blank">raceswild twitch channel</a> if you are a mod.
    p
      strong !setracetime &lt;link&gt;
    p
      strong !setbingo &lt;link&gt;
    v-divider
    .mx-n1.mt-4
      v-btn.mx-1(href="https://twitch.tv/raceswild" target="_blank" color="primary") Races Wild
      v-btn.mx-1(href="https://www.twitch.tv/moderator/raceswild" target="_blank" color="primary") Mod View
      v-btn.mx-1(href="https://dashboard.twitch.tv/u/raceswild/stream-manager" target="_blank" color="primary") Creator Dashboard
</template>

<script>
export default {
  data: () => ({
    raceData: {}
  }),
  async created() {
    this.raceData = await fetch('https://racing-events-api.3and3.dev')
      .then(response => response.json())
      .catch()
  }
}
</script>