<template lang="pug">
v-app
  v-container.admin.fade-in
    .d-flex.justify-start.align-center.flex-wrap
      v-btn.pa-0(text to="/" color="primary" x-large) Races Wild
      v-icon.mx-2(x-small) mdi-greater-than
      v-btn.pa-0(text disabled x-large) Admin
    v-divider.mb-4
    .d-flex.flex-column.align-start
      v-btn(text href="https://twitch.tv/raceswild" target="_blank" color="primary") Races Wild Twitch
      v-btn(text href="https://www.twitch.tv/moderator/raceswild" target="_blank" color="primary") Races Wild Mod View
      v-btn(text href="https://dashboard.twitch.tv/u/raceswild/stream-manager" target="_blank" color="primary") Creator Dashboard
      v-btn(text href="https://bingobaker.com/view/5782772" target="_blank" color="primary") Manage Bingo
</template>
