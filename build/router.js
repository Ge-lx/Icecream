'use strict';

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _expressVue = require('express-vue');

var _expressVue2 = _interopRequireDefault(_expressVue);

var _glob = require('glob');

var _glob2 = _interopRequireDefault(_glob);

var _bodyParser = require('body-parser');

var _bodyParser2 = _interopRequireDefault(_bodyParser);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

module.exports.init = function (app, config) {
  // setup middleware

  var expressVueMiddleware = _expressVue2.default.init(config.vueOptions);
  app.use(expressVueMiddleware);

  app.use(_bodyParser2.default.json());
  app.use(_bodyParser2.default.urlencoded({
    extended: true
  }));

  app.use('/static', _express2.default.static('static'));

  // register routes

  var router = _express2.default.Router();

  var controllers = _glob2.default.sync(config.root + '/routes/**/*.js');
  controllers.forEach(function (controller) {
    console.log(' + ' + controller + '...');
    require(controller).default(router);
  });

  app.use('/', router);

  // 404 and Error handler

  app.use(function (req, res) {
    var data = {
      title: 'Error 404'
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
      errorCode: error.code,
      error: error.stack
    };

    if (res.statusCode) {
      res.renderVue('error.vue', data);
    } else {
      next();
    }
  });
};
//# sourceMappingURL=router.js.map
