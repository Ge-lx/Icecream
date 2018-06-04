const WebSocket = require('ws')

export default {
  data () {
    return {
      client: null
    }
  },
  methods: {
    getToken () {
      return new Promise((resolve, reject) => {
        axios({
          method: 'GET',
          url: '/ws/token'
        }).then(res => {
          if (res.status === 200) {
            resolve(res.data.token)
          } else reject(res.data)
        })
      })
    },
    establishConnection (user, sesskey) {
      let vm = this
      return this.getToken().then(token => {
        var url = `ws://${window.location.href.split('/')[2]}/ws/${token}` + (sesskey ? `/${sesskey}` : '')
        console.log('Connecting to websocket at ' + url)

        var ws = new WebSocket(url)
        return new Promise((resolve, reject) => {
          ws.onerror = reject
          ws.onopen = function () {
            console.log('WS Connection established')
            vm.client = new Client(user, ws, vm.connectionClosed, vm.$emit.bind(vm))
            resolve(vm.client)
          }
        })
      }).catch(err => {
        console.log(JSON.stringify(err, null, 2))
      })
    },
    connectionClosed () {
      this.client = null
    }
  }
}
