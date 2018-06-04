class Client {
  constructor (user, socket, onClose, emitEvent) {
    this.user = user
    this.socket = socket
    this.waiting = {} // Maps responseTokens to handlers
    this.emitEvent = emitEvent

    socket.onmessage = this.onMessage.bind(this)
    socket.onclose = onClose
    socket.onerror = this.onError.bind(this)
  }

  send (msg) {
    this.socket.send(JSON.stringify(msg))
  }

  close () {
    this.socket.close()
  }

  onError (error) {
    console.log(this.user + ': ' + error)
  }

  getResponseFor (json, timeout) {
    var thisClient = this
    return new Promise((resolve, reject) => {
      var token = crypto.randomBytes(16).toString('hex')
      json.responseToken = token
      thisClient.sendMessage(json)

      var timer = setTimeout(reject, timeout, 'timeout')
      thisClient.waiting[token] = function (json) {
        clearTimeout(timer)
        delete thisClient.waiting[token]
        resolve(json)
      }
    })
  }

  onMessage (message) {
    try {
      var json = JSON.parse(message.data)
    } catch (e) {
      this.onError('Received invalid message: ' + e)
    }

    console.log(this.user + ': ' + JSON.stringify(json, null, 2))

    if (json.responseToken !== undefined) {
      var token = json.responseToken
      if (this.waiting[token] === undefined) {
        console.error('Received unknown responseToken')
      } else {
        this.waiting[token](json.payload)
      }
    }

    this.emitEvent(json.action, json.payload)
  }
}
