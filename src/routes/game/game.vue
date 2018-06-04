<template lang='pug'>
div
  headComponent(:user='user')
  floatMiddle(title='WebSocket')
    pre {{JSON.stringify(this.client, null, 2)}}
    .list
      .list_elem(v-for='email in clients')
        h4 {{email}}
        p is Online
</template>

<script>
import floatMiddle from '../../components/floatMiddle.vue'
import headComponent from '../../components/head.vue'
import wsmixin from '../../mixins/websocket'

export default {

  name: 'game',
  components: {floatMiddle, headComponent},
  mixins: [wsmixin],
  data () {
    return {
      clients: {}
    }
  },
  mounted () {
    this.establishConnection(this.user.email, this.sesskey).then(client => {
      console.log(client)
    })

    this.$on('client_list', payload => {
      this.clients = payload
    })

    this.$on('client_connected', payload => {
      this.$set(this.clients, payload.id, payload.email)
    })

    this.$on('client_disconnected', payload => {
      if (this.clients.hasOwnProperty(payload.id)) this.$delete(this.clients, payload.id)
    })

    this.$on('hello', payload => {
      alert('hello ' + payload)
    })

    this.$on('broadcast', payload => {
      alert('broadcast: ' + payload)
    })
  }
}
</script>

<style lang="css" scoped>
</style>