'use strict';

var _ws = require('ws');

var _ws2 = _interopRequireDefault(_ws);

var _crypto = require('crypto');

var _crypto2 = _interopRequireDefault(_crypto);

var _clientConnection = require('./clientConnection');

var _clientConnection2 = _interopRequireDefault(_clientConnection);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var tokens = {}; // Token list { user: token, ...}
var clients = {}; // Connected clients { user: Handler, ...}
var wss = null; // WebSocket Server

// Starts the websocket / sets up handlers
var startServer = function startServer(server, cfg) {
  return new Promise(function (resolve, reject) {
    console.log('Starting webSocket server...');

    wss = new _ws2.default.Server({ server: server });

    // Checks if the supplied token is in token list
    wss.shouldHandle = function (req) {
      var spliturl = req.url.split('/'); // Get token from request url
      return spliturl.length > 2 && tokens.hasOwnProperty(spliturl[2]);
    };

    wss.on('listening', resolve); // Resolve when server is ready

    // Valid connection, checked before. Handle connection, delete token
    wss.on('connection', function (socket, req) {
      var token = req.url.split('/')[2];
      var user = tokens[token];
      addClient(user, socket);
      delete tokens[token];
    });

    wss.on('error', reject);
  });
};

var isConnected = function isConnected() {
  return wss !== null;
};

var stopServer = function stopServer() {
  return new Promise(function (resolve, reject) {
    wss.close(resolve);
  });
};

// Generate new token. Called by clients thourgh dashbaord.js (http)
var getClientToken = function getClientToken(user) {
  var token = _crypto2.default.randomBytes(32).toString('hex');
  tokens[token] = user;
  return token;
};

// Called when new client connects
var addClient = function addClient(user, socket) {
  // One connection per client.
  if (clients.hasOwnProperty(user)) {
    console.log('Duplicate connection from ' + user + '. Dropping old one.');
    clients[user].close();
  } else {
    console.log('New connection from ' + user);
  }

  var client = new _clientConnection2.default(user, socket, function () {
    // This is the onClose function
    console.log(user + ' disconnected.');
    delete clients[user];
  });
  clients[user] = client; // Save client
};

// Sends a message to all clients
var broadcast = function broadcast(json) {
  Object.keys(clients).forEach(function (element) {
    clients[element].sendMessage(json);
  });
};

var updateChanges = function updateChanges() {
  var msg = {
    action: 'listChanges',
    payload: null
  };
  broadcast(msg);
};

var getClientList = function getClientList() {
  return clients;
};

module.exports = {
  startServer: startServer,
  stopServer: stopServer,
  getClientToken: getClientToken,
  getClientList: getClientList,
  isConnected: isConnected,
  broadcast: broadcast,
  updateChanges: updateChanges
};
//# sourceMappingURL=websocket.js.map
