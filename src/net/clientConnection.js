class ClientConnection {
  constructor (user, socket, onClose) {
    this.user = user
    this.socket = socket

    socket.on('message', this.onMessage.bind(this))
    socket.on('close', onClose)
    socket.on('error', this.onError.bind(this))
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
  }

  close () {
    this.socket.close()
  }

  onError (error) {
    console.err(this.user + ': ' + error)
  }
}

export default ClientConnection
