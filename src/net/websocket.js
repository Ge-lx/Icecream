import WebSocket from 'ws'
import crypto from 'crypto'
import ClientConnection from './clientConnection'

var tokens = {} // Token list { user: token, ...}
var clients = {} // Connected clients { user: Handler, ...}
var wss = null // WebSocket Server

// Starts the websocket / sets up handlers
const startServer = function (server, cfg) {
  return new Promise((resolve, reject) => {
    console.log('Starting webSocket server...')

    wss = new WebSocket.Server({ server: server })

    // Checks if the supplied token is in token list
    wss.shouldHandle = function (req) {
      var spliturl = req.url.split('/') // Get token from request url
      return spliturl.length > 2 && tokens.hasOwnProperty(spliturl[2])
    }

    wss.on('listening', resolve) // Resolve when server is ready

    // Valid connection, checked before. Handle connection, delete token
    wss.on('connection', function (socket, req) {
      var token = req.url.split('/')[2]
      var user = tokens[token]
      addClient(user, socket)
      delete tokens[token]
    })

    wss.on('error', reject)
  })
}

const isConnected = function () {
  return wss !== null
}

const stopServer = function () {
  return new Promise((resolve, reject) => {
    wss.close(resolve)
  })
}

// Generate new token. Called by clients thourgh dashbaord.js (http)
const getClientToken = function (user) {
  var token = crypto.randomBytes(32).toString('hex')
  tokens[token] = user
  return token
}

// Called when new client connects
const addClient = function (user, socket) {
  // One connection per client.
  if (clients.hasOwnProperty(user)) {
    console.log('Duplicate connection from ' + user + '. Dropping old one.')
    clients[user].close()
  } else {
    console.log('New connection from ' + user)
  }

  var client = new ClientConnection(user, socket, () => {
    // This is the onClose function
    console.log(user + ' disconnected.')
    delete clients[user]
  })
  clients[user] = client // Save client
}

// Sends a message to all clients
const broadcast = function (json) {
  Object.keys(clients).forEach(function (element) {
    clients[element].sendMessage(json)
  })
}

const updateChanges = function () {
  let msg = {
    action: 'listChanges',
    payload: null
  }
  broadcast(msg)
}

const getClientList = function () {
  return clients
}

module.exports = {
  startServer: startServer,
  stopServer: stopServer,
  getClientToken: getClientToken,
  getClientList: getClientList,
  isConnected: isConnected,
  broadcast: broadcast,
  updateChanges: updateChanges
}
