<template lang="pug">
v-app
  v-container.guide.fade-in
    .d-flex.justify-start.align-center.flex-wrap
      v-btn.breadcrumb.pa-0(text to="/" color="primary" x-large) Races Wild
      v-icon.mx-2(x-small) mdi-greater-than
      v-btn.breadcrumb.pa-0(text to="/guides" color="primary" x-large) Guides
      v-icon.mx-2.fade-in(x-small v-if="ready") mdi-greater-than
      v-btn.breadcrumb.pa-0.fade-in(text disabled x-large v-if="ready") {{guide ? guide.title : '404'}}
    v-divider.mb-4
    div(v-if="ready")
      div(v-if="!guide")
        p Guide not found.
      div(v-else v-html="guide.content_md")
</template>

<script>
let markdown = require('markdown').markdown

export default {
  data: () => ({
    ready: false,
    api: 'https://data.mongodb-api.com/app/data-bayhy/endpoint/rw',
    guide: undefined
  }),
  methods: {
    async init() {
      this.ready = false
      let slug = this.$route.params && this.$route.params.slug
      let guide = await fetch(`${this.api}/guide?slug=${slug}`)
        .then(data => data.json())
        .then(json => json.result)
      if(guide)
        guide.content_md = markdown.toHTML(guide.content)
      this.guide = guide
      this.ready = true
    }
  },
  mounted() {
    this.init()
  },
  watch: {
    '$route.params.slug': function() {
      this.init()
    }
  }
}
</script>