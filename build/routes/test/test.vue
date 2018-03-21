<template lang='pug'>
div
  headComponent
  #sidebar
    h2.title Sidebar
    .divider
    button(@click='show') Show secret
    p.secret(v-if='showSecret' v-html='random')
    p.ip(v-html='clientIP')

  #main
    p.
      Modem dome tower long-chain hydrocarbons car courier alcohol soul-delay rebar shanty town convenience store chrome hacker concrete dolphin meta. Dissident face forwards kanji ablative table artisanal-ware weathered tattoo assault beef noodles lights. Numinous shanty town semiotics pen realism assault BASE jump long-chain hydrocarbons. Marketing systemic dissident sensory receding urban fetishism 3D-printed physical youtube. 
    .divider
    p.
      'Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod
      tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam,
      quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo
      consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse
      cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non
      proident, sunt in culpa qui officia deserunt mollit anim id est laborum.'
  footComponent
</template>

<script>
import headComponent from '../head.vue'
import footComponent from './foot.vue'

export default {

  name: 'test',
  components: {headComponent, footComponent},
  data () {
    return {
      showSecret: false
    }
  },
  methods: {
    show () {
      this.showSecret = !this.showSecret
    }
  }
}
</script>


<style>

#sidebar {
  padding: 1em;
}

#main {
  padding: 1em;
}

@media screen and (max-width: 900px) {

}
</style>