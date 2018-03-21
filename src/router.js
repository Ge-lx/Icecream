import express from 'express'
import expressVue from 'express-vue'
import glob from 'glob'
import bodyParser from 'body-parser'

module.exports.init = function (app, config) {
  // setup middleware

  const expressVueMiddleware = expressVue.init(config.vueOptions)
  app.use(expressVueMiddleware)

  app.use(bodyParser.json())
  app.use(bodyParser.urlencoded({
    extended: true
  }))

  app.use('/static', express.static('static'))

  // register routes

  let router = express.Router()

  let controllers = glob.sync(config.root + '/routes/**/*.js')
  controllers.forEach(function (controller) {
    console.log(' + ' + controller + '...')
    require(controller).default(router)
  })

  app.use('/', router)

  // 404 and Error handler

  app.use((req, res) => {
    const data = {
      title: 'Error 404'
    }
    const vueOptions = {
      head: {
        title: 'Error 404'
      }
    }
    res.statusCode = 404
    res.renderVue('error.vue', data, vueOptions)
  })

  app.use(function onError (error, req, res, next) {
    res.statusCode = 500
    let data = {
      debug: config.env === 'development',
      errorCode: error.code,
      error: error.stack
    }

    if (res.statusCode) {
      res.renderVue('error.vue', data)
    } else {
      next()
    }
  })
}
