import websocket from '../../net/websocket'

let players = {/* user.id: { user: {..}, client: {..} */}

function broadcast (json, except) {
  for (let id in players) {
    if (except && id === except) continue
    players[id].client.sendMessage(json)
  }
}

function clientListJSON () {
  let clientList = {}
  for (let id in players) clientList[id] = players[id].user.email
  return clientList
}

export default (router, config) => {
  router.get('/chat', (req, res) => {
    if (!req.user) {
      req.session.next = '/chat'
      return res.redirect('/login')
    }
    let user = req.user

    const data = {
      user: user,
      sesskey: websocket.getSessionKey(user,
        json => {
          console.log(user.email + ': ' + JSON.stringify(json, null, 2))
          switch (json.action) {
            case 'echo':
              players[user.id].client.getAnswerFunction(json)(json.payload)
              break
            case 'broadcast':
              broadcast({ action: 'broadcast', payload: json.payload })
              break
            default:
              console.error('Unknown action: ' + json.action)
          }
        },
        client => {
          console.log(user.email + ' connected!')
          players[user.id] = { user: user, client: client }
          broadcast({action: 'client_connected', payload: { id: user.id, email: user.email }}, user.id)
          client.sendMessage({ action: 'client_list', payload: clientListJSON() })
        },
        client => {
          console.log(user.email + ' disconnected!')
          delete players[user.id]
          broadcast({action: 'client_disconnected', payload: { id: user.id }})
        })
    }

    req.vueOptions = {
      head: {
        title: 'Game test',
        scripts: [{src: '/static/ws-client.js'}, {src: 'https://unpkg.com/axios/dist/axios.min.js'}]
      }
    }

    res.renderVue('/chat/list.vue', data, req.vueOptions)
  })
}
