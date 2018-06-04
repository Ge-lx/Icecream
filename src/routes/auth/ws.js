import websocket from '../../net/websocket'

export default (router, config) => {
  router.get('/ws/token', (req, res, next) => {
    if (req.user === undefined) res.sendStatus(403)
    else res.json({token: websocket.getClientToken(req.user)})
  })

  router.get('/ws/', (req, res, next) => {
    const data = {
      user: req.user
    }

    req.vueOptions = {
      head: {
        title: 'Websocket test',
        scripts: [{src: '/static/ws-client.js'}, {src: 'https://unpkg.com/axios/dist/axios.min.js'}]
      }
    }

    res.renderVue('auth/ws.vue', data, req.vueOptions)
  })
}
