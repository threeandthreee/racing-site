<template lang="pug">
v-app
  v-container.checklist.fade-in 
    .d-flex.justify-start.align-center.flex-wrap
      v-btn.pa-0(text to="/" color="primary" x-large) Races Wild
      v-icon.mx-2(x-small) mdi-greater-than
      v-btn.pa-0(text disabled x-large) Checklist
    v-divider.mb-4 
    v-row 
      v-col(v-for="(group, label) of items" :key="label" cols=6)
        v-card(outlined)
          v-card-title.pb-0 {{label}}
          .px-2.pb-4
            v-checkbox(
              v-for="item of group"
              :key="item"
              :label="item"
              hide-details
              dense
            )
</template>

<script>
export default {
  data: () => ({
    items: {
      'Pre-stream': [
        'Switch to RacesWild profile',
        'Set stream title, notifications, and tabs',
        'Configure local scene',
        'Switch to RacesWild scene',
        'Open windows for race participants',
        'Set labels'
      ],
      'Audio': [
        'Check that mic filters are enabled',
        'All but browser audio disabled for stream mix',
        'Only stream mix audio enabled in OBS',
        'Donor audio stream window unmuted',
        'Verify audio level of donor stream'
      ],
      'Pre-race': [
        'Create racetime (no streaming requirement!)',
        'Set marker',
        'Prep personal bingo card',
        'Check that delay is activated'
      ],
      'Post-race': [
        'Set marker',
        'Clip highlight',
        'Record results in calendar'
      ]
    }
  })
}
</script>

<style >
.checklist .v-input--is-label-active label {
  color: #ccc;
  text-decoration: line-through;
}
</style>