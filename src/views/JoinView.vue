<template lang="pug">
v-app
  v-container.join.fade-in
    .width-wrapper
      .d-flex.justify-start.align-center.flex-wrap
        v-btn.pa-0(text to="/" color="primary" x-large) Races Wild
        v-icon.mx-2(x-small) mdi-greater-than
        v-btn.pa-0(text disabled x-large) Join the Restream
      v-timeline(dense align-top)
        v-timeline-item(icon="mdi-numeric-1" fill-dot)
          .card-wrapper
            v-card.tl-card.elevation-6
              v-card-text Join the <a href="https://discord.gg/V7caHdC8r3" target="_blank">Aces Wild Discord</a> and head to <strong>#role-selection</strong> to get access to the race channels.
        v-timeline-item(icon="mdi-numeric-2" fill-dot)
          .card-wrapper
            v-card.tl-card.elevation-6
              v-card-text
                div Prepare a streaming scene with oversized elements. Put a big timer in the upper right and if you'd like, a big webcam feed in the bottom right. Your name label will be placed in the lower left corner. Your screen will come through at half the size, so make your elements twice as big.
                v-expansion-panels.mt-4
                  v-expansion-panel
                    v-expansion-panel-header.py-0
                      .d-flex.justify-start.align-center
                        v-icon.mr-2(large color="primary") mdi-image-area
                        div Example Scene Layout
                    v-expansion-panel-content
                      v-img.mb-2(src="/streamexample.png")
                  v-expansion-panel
                    v-expansion-panel-header.py-0
                      .d-flex.justify-start.align-center
                        v-icon.mr-2(large color="primary") mdi-video
                        div Tutorial: Restream Scene Setup
                    v-expansion-panel-content
                      iframe(src="https://player.twitch.tv/?video=1659668461&parent=raceswild.3and3.dev&parent=racing.3and3.dev&parent=raceswild.com&parent=localhost&autoplay=false" frameborder="0" allowfullscreen="true" scrolling="no" width="100%" style="aspect-ratio: 16/9")
        v-timeline-item(icon="mdi-numeric-3" fill-dot)
          .card-wrapper
            v-card.tl-card.elevation-6
              v-card-text
                p Enable <a href="https://obsproject.com/eu/kb/virtual-camera-guide" target="_blank">OBS Virtual Camera</a> targeting the scene you just made and join the restream room. You can find the link and password for the restream room on the discord server in the <strong>#race-instructions</strong> channel.
                p Make sure to use a chrome-based browser and select <strong>Join Room with Camera</strong>. Please do NOT use the screenshare option, it causes issues with the restream layout.
                p Set the video feed to the virtual camera and your audio feed to your game capture audio.
                p Feel free to stream to your own channel during the race with whatever scene you like. If you followed the instructions, your virtual camera will stay locked to the correct scene.
                v-expansion-panels
                  v-expansion-panel
                    v-expansion-panel-header.py-0
                      .d-flex.justify-start.align-center
                        v-icon.mr-2(large color="primary") mdi-video
                        div Tutorial: Joining the Restream
                    v-expansion-panel-content
                      iframe(src="https://player.twitch.tv/?video=1659668462&parent=raceswild.3and3.dev&parent=racing.3and3.dev&parent=raceswild.com&parent=localhost&autoplay=false" frameborder="0" allowfullscreen="true" scrolling="no" width="100%" style="aspect-ratio: 16/9")
        v-timeline-item(icon="mdi-numeric-4" fill-dot)
          .card-wrapper
            v-card.tl-card.elevation-6
              v-card-text
                p Join the racetime and ready up. (Make a <a href="https://racetime.gg" target="_blank">racetime.gg</a> account if you haven't already.)
                p.mb-0 The racetime usually isn't created until just before the race. At that point you'll be able to find it on discord, <a href="https://twitch.tv/raceswild" target="_blank">twitch.tv/raceswild</a> with the <strong>!racetime</strong> command, or just through the directory of active races in livesplit.
        v-timeline-item(icon="mdi-numeric-5" fill-dot)
          .card-wrapper
            v-card.tl-card.elevation-6
              v-card-text
                p.mb-0 Good luck and have fun!
</template>

<style lang="stylus">
.join
  .width-wrapper
    max-width: 900px
  .card-wrapper
    margin: 0 -16px
    width: calc(100%+30px)
    .tl-card
      max-width: 900px
      margin: 28px 0 25px -96px
  .v-expansion-panel-content, .v-expansion-panel-content__wrap
    padding: 0
</style>