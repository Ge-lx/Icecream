import express from 'express'
import path from 'path'
import http from 'http'
import router from './router'
import websocket from './net/websocket.js'

const CONFIG = {
  env: process.env.NODE_ENV || 'development',
  root: __dirname,
  port: 8080,
  vueOptions: {
    rootPath: path.join(__dirname, 'routes'),
    // vueVersion: '2.5.13',
    head: {
      styles: [{ style: 'static/style.css' }],
      metas: [
        { name: 'viewport', content: 'width=device-width, initial-scale=1.0' }
      ]
    }
  }
}

var app = express()

app.locals.ENV = CONFIG.env
app.locals.ENV_DEVELOPMENT = (CONFIG.env === 'development')
app.locals.rootPath = process.env.ROOT_PATH

console.log('Initializing app. Loading componentes...')
router.init(app, CONFIG)
console.log('Loaded.')

// -------------------------BEGIN WEBSOCKET SETUP-------------
console.log('Starting HTTP Server...')

new Promise((resolve, reject) => {
  let server = http.createServer(app)

  websocket.startServer(server, CONFIG) // Starting Websocket server

  server.listen(CONFIG.port)
  server.on('error', reject)
  server.on('listening', resolve)
}).then(() => {
  console.log(`Worker ${process.pid} running a ${CONFIG.env} server. Listening on ${CONFIG.port}`)
}).catch((error) => {
  if (error.syscall !== 'listen') {
    throw error
  }
  // handle specific listen errors with friendly messages
  switch (error.code) {
    case 'EACCES':
      console.err('Port ' + CONFIG.bind_port + ' requires elevated privileges')
      process.exit(1)
    case 'EADDRINUSE':
      console.err('Port ' + CONFIG.bind_port + ' is already in use')
      process.exit(1)
    default:
      throw error
  }
})
