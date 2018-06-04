<template lang='pug'>
div
  headComponent(:user=user)
  floatMiddle(title='WebSocket')
    pre {{JSON.stringify(this.client, null, 2)}}
</template>

<script>
import floatMiddle from '../../components/floatMiddle.vue'
import headComponent from '../../components/head.vue'
import wsmixin from '../../mixins/websocket'

export default {

  name: 'ws',
  components: {floatMiddle, headComponent},
  mixins: [wsmixin],
  data () {
    return {

    }
  },
  mounted () {
    this.establishConnection(this.user.email)
  }
}
</script>

<style lang="css" scoped>
</style>