import websocket from '../net/websocket'

export default (router) => {
  router.get('/home', (req, res) => {
    const data = {
      user: req.user,
      session: req.session,
      ws_users: Object.keys(websocket.getClientList())
    }

    req.vueOptions = {
      head: {
        title: 'Icecream',
        scripts: [{src: 'https://unpkg.com/axios/dist/axios.min.js'}]
      }
    }

    res.renderVue('home.vue', data, req.vueOptions)
  })
}
