'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
var WebSocket = require('ws');

exports.default = {
  data: function data() {
    return {
      client: null
    };
  },

  methods: {
    getToken: function getToken() {
      return new Promise(function (resolve, reject) {
        axios({
          method: 'GET',
          url: '/ws/token'
        }).then(function (res) {
          if (res.status === 200) {
            resolve(res.data.token);
          } else reject(res.data);
        });
      });
    },
    establishConnection: function establishConnection(user, sesskey) {
      var vm = this;
      return this.getToken().then(function (token) {
        var url = 'ws://' + window.location.href.split('/')[2] + '/ws/' + token + (sesskey ? '/' + sesskey : '');
        console.log('Connecting to websocket at ' + url);

        var ws = new WebSocket(url);
        return new Promise(function (resolve, reject) {
          ws.onerror = reject;
          ws.onopen = function () {
            console.log('WS Connection established');
            vm.client = new Client(user, ws, vm.connectionClosed, vm.$emit.bind(vm));
            resolve(vm.client);
          };
        });
      }).catch(function (err) {
        console.log(JSON.stringify(err, null, 2));
      });
    },
    connectionClosed: function connectionClosed() {
      this.client = null;
    }
  }
};
//# sourceMappingURL=websocket.js.map
