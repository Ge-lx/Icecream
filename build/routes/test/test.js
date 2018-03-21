'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _crypto = require('crypto');

var _crypto2 = _interopRequireDefault(_crypto);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = function (router) {
  router.get('/test', function (req, res, next) {
    var data = {
      random: _crypto2.default.randomBytes(16).toString('hex'),
      clientIP: req.hostname
    };

    req.vueOptions = {
      head: {
        title: 'Random test'
      }
    };

    res.renderVue('test/test.vue', data, req.vueOptions);
  });
};
//# sourceMappingURL=test.js.map
