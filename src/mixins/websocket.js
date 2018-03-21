const WebSocket = require('ws')

export default {
  data () {
    return {
      client: null
    }
  },
  methods: {
    establishConnection (user, url) {
      let vm = this
      return new Promise((resolve, reject) => {
        console.log('Connecting to websocket at ' + url)
        var ws = new WebSocket(url)

        ws.onerror = reject
        ws.onopen = function () {
          console.log('WS Connection established')
          vm.client = new Client(user, ws, vm.connectionClosed, vm.$emit)
          resolve()
        }
      }).catch(err => {
        console.log(err)
      })
    },
    connectionClosed () {
      this.client = null
    }
  }
}
