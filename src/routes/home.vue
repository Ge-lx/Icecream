<template lang='pug'>
div
  headComponent(:user='user')
  floatMiddle(title='Icecream')
    pre(v-if='user') User: {{JSON.stringify(user, null, 2)}} 
    pre Session: {{JSON.stringify(session, null, 2)}}
    pre WS Connections: {{JSON.stringify(ws_users, null, 2)}} 
</template>

<script>
import headComponent from '../components/head.vue'
import floatMiddle from '../components/floatMiddle.vue'

export default {
  name: 'home',
  components: {headComponent, floatMiddle},
  data () {
    return {
      something: 'Hello, world!'
    }
  }
}
</script>
<style scoped>

</style>