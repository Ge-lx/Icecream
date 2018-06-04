<template lang='pug'>
div
  headComponent(:user='user')
  floatMiddle(title='Chat')
    p Users online
    .list
      .list_elem(v-for='email in clients')
        h4 🤬
        h4 {{email}}
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

  div.list_elem {
    padding: 0.3em;
    display: flex;
    flex-flow: row nowrap;
    align-items: flex-start;
    justify-content: flex-start;
    border: 1px solid rgba(0, 0, 0, 0.12);
    border-radius: 0.3em;
    user-select: none;
  }

  div.list_elem:hover {
    box=
  }

</style>