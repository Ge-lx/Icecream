<template lang='pug'>
div
  headComponent
  div
    p otherData
    p something
</template>

<script>
import headComponent from './head.vue'
import websocket from '../mixins/websocket'

export default {
  name: 'home',
  mixins: [websocket],
  components: {headComponent},
  data () {
    return {
      something: 'Hello, world!'
    }
  },
  mounted () {
    this.establishConnection(this.random, 'ws://localhost:8080/ws/' + this.token)
  }
}
</script>
<style scoped>

</style>