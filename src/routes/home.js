import websocket from '../net/websocket'
import crypto from 'crypto'

export default (router) => {
  router.get('/', (req, res, next) => {
    var user = crypto.randomBytes(8).toString('hex').toUpperCase()
    const data = {
      random: user,
      token: websocket.getClientToken(user)
    }

    req.vueOptions = {
      head: {
        title: 'Page Title',
        scripts: [{src: 'static/ws-client.js'}]
      }
    }

    res.renderVue('home.vue', data, req.vueOptions)
  })
}
