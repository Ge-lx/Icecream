'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var ClientConnection = function () {
  function ClientConnection(user, socket, onClose) {
    _classCallCheck(this, ClientConnection);

    this.user = user;
    this.socket = socket;

    socket.on('message', this.onMessage.bind(this));
    socket.on('close', onClose);
    socket.on('error', this.onError.bind(this));
  }

  // Returns an answer-function. This preserves the response-token


  _createClass(ClientConnection, [{
    key: 'getAnswerFunction',
    value: function getAnswerFunction(json) {
      var _this = this;

      var answer = function answer(payload) {
        json.payload = payload;
        _this.sendMessage(json);
      };
      return answer.bind(this);
    }
  }, {
    key: 'onMessage',
    value: function onMessage(message) {
      try {
        var json = JSON.parse(message);
      } catch (e) {
        this.onError('Received invalid message: ' + e);
      }

      console.log(this.user + ': ' + JSON.stringify(json));

      switch (json.action) {}
    }
  }, {
    key: 'close',
    value: function close() {
      this.socket.close();
    }
  }, {
    key: 'onError',
    value: function onError(error) {
      console.err(this.user + ': ' + error);
    }
  }]);

  return ClientConnection;
}();

exports.default = ClientConnection;
//# sourceMappingURL=clientConnection.js.map
