<template lang='pug'>
div.section
  p.title {{section.name}}
  .files
    secMod.module(v-for='module in section.modules' :module='module' :expanded='section.open')
    p.summary(v-if='section.summary' v-html='section.summary')
</template>

<script>

import secMod from './section-module.vue'

export default {
  name: 'course-section',
  components: { secMod },
  data () {
    return {
    }
  },
  computed: {
  },
  props: {
    section: {type: Object}
  },
  methods: {
  }
}
</script>

<style type='css' scoped>
.section {
  display: flex;
  flex-flow: column nowrap;
  max-width: 300px;
  border-radius: 4px;
  background-color: white;
  margin: 8px;
  box-shadow: 0 1px 8px -1px rgba(0, 0, 0, 0.75);
}

p.title {
  text-align: center;
  font-weight: bold;
}

p.summary {
  color: rgba(0, 0, 0, 0.69);
  font-weight: light;
  font-size: 14px;
}

.files {
  display: flex;
  flex-flow: row wrap;
  justify-content: space-around;
  padding: 5px;
}
</style>