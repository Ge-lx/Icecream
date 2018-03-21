'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _websocket = require('../net/websocket');

var _websocket2 = _interopRequireDefault(_websocket);

var _crypto = require('crypto');

var _crypto2 = _interopRequireDefault(_crypto);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = function (router) {
  router.get('/', function (req, res, next) {
    var user = _crypto2.default.randomBytes(8).toString('hex').toUpperCase();
    var data = {
      random: user,
      token: _websocket2.default.getClientToken(user)
    };

    req.vueOptions = {
      head: {
        title: 'Page Title',
        scripts: [{ src: 'static/ws-client.js' }]
      }
    };

    res.renderVue('home.vue', data, req.vueOptions);
  });
};
//# sourceMappingURL=home.js.map
