class ClientConnection {
  constructor (user, socket, onClose) {
    this.user = user
    this.socket = socket

    socket.on('message', this.onMessage.bind(this))
    socket.on('close', onClose)
    socket.on('error', this.onError.bind(this))
  }

  external (onMessage, onError) {
    this.exMessage = onMessage
    this.exError = onError
  }

  // Send a message
  sendMessage (json) {
    this.socket.send(JSON.stringify(json))
  }

  // Returns an answer-function. This preserves the response-token
  getAnswerFunction (json) {
    var answer = (payload) => {
      json.payload = payload
      this.sendMessage(json)
    }
    return answer.bind(this)
  }

  onMessage (message) {
    try {
      var json = JSON.parse(message)
    } catch (e) {
      this.onError('Received invalid message: ' + e)
    }

    console.log(this.user + ': ' + JSON.stringify(json))

    switch (json.action) {
      // Handle all the shit
    }

    if (this.exMessage) this.exMessage(json)
  }

  close () {
    this.socket.close()
  }

  onError (error) {
    if (this.exError) this.exError(error)
    else console.err(this.user + ': ' + error)
  }
}

export default ClientConnection
