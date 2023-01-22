<template lang="pug">
v-app
  v-container.bingo.fade-in
    div(style="max-width: 500px")
      .d-flex.justify-start.align-center.flex-wrap
        v-btn.pa-0(text to="/" color="primary" x-large) Races Wild
        v-icon.mx-2(x-small) mdi-greater-than
        v-btn.pa-0(text disabled x-large) Bingo
      v-card.mb-4(outlined)
        iframe(width="100%" frameborder="0" style="aspect-ratio:1" src="https://bingobaker.com/#33b17ead56e6042a")
      p Play bingo while you watch the race! If these squares don't make sense to you, don't worry -- we'll call them out as they happen. Or ask us!
      p Our race may have more participants than fit on <a href="https://twitch.tv/raceswild" target="_blank">the restream</a> -- we're just scoring based on the restreamed runs.
</template>
