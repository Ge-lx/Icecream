'use strict';

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _expressVue = require('express-vue');

var _expressVue2 = _interopRequireDefault(_expressVue);

var _expressSession = require('express-session');

var _expressSession2 = _interopRequireDefault(_expressSession);

var _glob = require('glob');

var _glob2 = _interopRequireDefault(_glob);

var _morgan = require('morgan');

var _morgan2 = _interopRequireDefault(_morgan);

var _auth = require('./routes/auth/auth');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var LokiStore = require('connect-loki')(_expressSession2.default);

module.exports.init = function (app, config) {
  // setup middleware

  app.use((0, _morgan2.default)('dev'));
  // Use with the session middleware (replace express with connect if you use Connect)
  config.session.store = new LokiStore({ path: config.db.session, logErrors: true });
  app.use((0, _expressSession2.default)(config.session));

  var expressVueMiddleware = _expressVue2.default.init(config.vueOptions);
  app.use(expressVueMiddleware);

  app.set('json spaces', 2); // pretty-print json
  app.use(_express2.default.json());
  app.use(_express2.default.urlencoded({
    extended: true
  }));

  app.use('/static', _express2.default.static('static'));

  app.use(_auth.userAuthMiddleware);

  // register routes

  var controllers = _glob2.default.sync(config.root + '/routes/**/*.js');
  controllers.forEach(function (controller) {
    var router = _express2.default.Router();
    console.log(' + ' + controller + '...');
    require(controller).default(router, config);
    app.use('/', router);
  });

  // 404 and Error handler

  app.use(function (req, res) {
    var data = {
      error: new Error('404')
    };
    var vueOptions = {
      head: {
        title: 'Error 404'
      }
    };
    res.statusCode = 404;
    res.renderVue('error.vue', data, vueOptions);
  });

  app.use(function onError(error, req, res, next) {
    res.statusCode = 500;
    var data = {
      debug: config.env === 'development',
      error: error
    };

    if (res.statusCode) {
      res.renderVue('error.vue', data);
    } else {
      next();
    }
  });
};
//# sourceMappingURL=router.js.map
