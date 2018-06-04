import express from 'express'
import expressVue from 'express-vue'
import session from 'express-session'
import glob from 'glob'
import morgan from 'morgan'
import { userAuthMiddleware } from './routes/auth/auth'

const LokiStore = require('connect-loki')(session)

module.exports.init = function (app, config) {
  // setup middleware

  app.use(morgan('dev'))
  // Use with the session middleware (replace express with connect if you use Connect)
  config.session.store = new LokiStore({ path: config.db.session, logErrors: true })
  app.use(session(config.session))

  const expressVueMiddleware = expressVue.init(config.vueOptions)
  app.use(expressVueMiddleware)

  app.set('json spaces', 2) // pretty-print json
  app.use(express.json())
  app.use(express.urlencoded({
    extended: true
  }))

  app.use('/static', express.static('static'))

  app.use(userAuthMiddleware)

  // register routes

  let controllers = glob.sync(config.root + '/routes/**/*.js')
  controllers.forEach(function (controller) {
    let router = express.Router()
    console.log(' + ' + controller + '...')
    require(controller).default(router, config)
    app.use('/', router)
  })

  // 404 and Error handler

  app.use((req, res) => {
    const data = {
      error: new Error('404')
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
      error: error
    }

    if (res.statusCode) {
      res.renderVue('error.vue', data)
    } else {
      next()
    }
  })
}
