<template lang="pug">
v-app
  v-container.guide.fade-in
    .d-flex.justify-start.align-center.flex-wrap
      v-btn.breadcrumb.pa-0(text to="/" color="primary" x-large) Races Wild
      v-icon.mx-2(x-small) mdi-greater-than
      v-btn.breadcrumb.pa-0(text disabled x-large) Guides
    v-divider.mb-4
    .d-flex.flex-column.align-start
      v-btn(
        text
        v-for="guide in guides"
        key="_id"
        color="primary"
        :to="`/guide/${guide.slug}`"
      ) {{guide.title}}
</template>

<script>
export default {
  data: () => ({
    ready: false,
    api: 'https://data.mongodb-api.com/app/data-bayhy/endpoint/rw',
    guides: []
  }),
  methods: {
    async init() {
      this.ready = false
      this.guides = await fetch(`${this.api}/guides`)
        .then(data => data.json())
        .then(json => json.result)
      this.ready = true
    }
  },
  mounted() {
    this.init()
  }
}
</script>