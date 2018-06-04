'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _websocket = require('../net/websocket');

var _websocket2 = _interopRequireDefault(_websocket);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = function (router) {
  router.get('/home', function (req, res) {
    var data = {
      user: req.user,
      session: req.session,
      ws_users: Object.keys(_websocket2.default.getClientList())
    };

    req.vueOptions = {
      head: {
        title: 'Icecream',
        scripts: [{ src: 'https://unpkg.com/axios/dist/axios.min.js' }]
      }
    };

    res.renderVue('home.vue', data, req.vueOptions);
  });
};
//# sourceMappingURL=home.js.map
