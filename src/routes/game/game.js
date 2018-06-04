import websocket from '../../net/websocket'
import { Game } from '../../game/2p.js'

let players = {/* user.id: { user: {..}, client: {..} */}
let game = null
let currentPlayer = null

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

// 'PLAYER_JOIN': 1, 'PLAYER_READY': 2, 'GAME_READY': 3, 'START_GAME': 4, 'SHUFFLE': 5,
// 'GIVE_CARD': 6, 'NEXT_PLAYER': 7, 'RAISE': 8, 'CALL_HANDS': 9, 'PLAYER_OUT': 10

function initGame () {
  game = new Game()

  let forward = ['PLAYER_READY', 'SHUFFLE', 'RAISE', 'CALL_HANDS', 'GAME_READY']
  forward.forEach(name => {
    game.on(name, event => broadcast({action: name, event: event}))
  })
  game.on('NEXT_PLAYER', event => {
    let player = event.player
    currentPlayer = players[player.id]
    currentPlayer.raise = event.raise
    currentPlayer.call = event.call
    broadcast({action: 'NEXT_PLAYER', event: {player: player.id}})
  })
  game.on('START_GAME', event => {

  })
  game.on('GIVE_CARD', event => {
    let player = event.player
    broadcast({action: 'GIVE_CARD', event: {player: player}}, player)
    players[player].client.sendMessage({
      action: 'GIVE_CARD',
      event: {player: player, card: event.card}
    })
  })
  game.on('PLAYER_JOIN', event => {
    this.players[event.player.id].ready = event.player.ready
  })
}

export default (router, config) => {
  initGame()

  router.get('/game', (req, res) => {
    if (!req.user) {
      req.session.next = '/game'
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
            case 'START_GAME':
              if (!game.ready) {
                players[user.id].client.sendMessage({action: 'NOT_READY', playload: {}})
              } else {
                game.startGame()
              }
              break
            case 'READY':
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
          game.addPlayer(user.id, user.email)
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

    res.renderVue('/game/game.vue', data, req.vueOptions)
  })
}
