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
    establishConnection: function establishConnection(user, url) {
      var vm = this;
      return new Promise(function (resolve, reject) {
        console.log('Connecting to websocket at ' + url);
        var ws = new WebSocket(url);

        ws.onerror = reject;
        ws.onopen = function () {
          console.log('WS Connection established');
          vm.client = new Client(user, ws, vm.connectionClosed, vm.$emit);
          resolve();
        };
      }).catch(function (err) {
        console.log(err);
      });
    },
    connectionClosed: function connectionClosed() {
      this.client = null;
    }
  }
};
//# sourceMappingURL=websocket.js.map
