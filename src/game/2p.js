const SUITS = ['Hearts', 'Diamonds', 'Clubs', 'Spades']
const VALUES = [2, 3, 4, 5, 6, 7, 8, 9, '10', 'Jack', 'Queen', 'King', 'Ace']

const SUIT_UNICODE = { 'Spades': 'A', 'Hearts': 'B', 'Diamonds': 'C', 'Clubs': 'D' }
const VALUE_UNICODE = { 'Ace': 1, '10': 'A', 'Jack': 'B', 'Queen': 'C', 'King': 'D' }

class Card {
  constructor (suit, value) {
    this.suit = suit
    this.value = value
  }

  toString () {
    return this.value + ' of ' + this.suit
  }

  numericalValue () {
    if (this.value === 'Ace') return 14 // Ace
    return Number.isInteger(this.value) ? this.value : parseInt(VALUE_UNICODE[this.value], 16)
  }

  toUnicode () {
    let unicodeValue = Number.isInteger(this.value) ? this.value : VALUE_UNICODE[this.value]
    return String.fromCodePoint('0x1F0' + SUIT_UNICODE[this.suit] + unicodeValue)
  }
}

let DECK = new Array(0)
SUITS.forEach(suit => {
  VALUES.forEach(value => {
    DECK.push(new Card(suit, value))
  })
})
Object.freeze(DECK)

class Deck {
  constructor () {
    this.deck = DECK.slice()
    shuffle(this.deck)
  }

  drawCard () {
    return this.deck.pop()
  }
}

function shuffle (a) {
  var j, x, i
  for (i = a.length - 1; i > 0; i--) {
    j = Math.floor(Math.random() * (i + 1))
    x = a[i]
    a[i] = a[j]
    a[j] = x
  }
}

class Player {
  constructor (id, name) {
    this.id = id
    this.name = name
    this.numCards = 1
    this.isReady = false
    this.cards = []
  }

  giveCard (card) {
    if (this.cards.length < 2) {
      this.cards.push(card)
    } else {
      throw new Error('More than two cards!')
    }
  }

  toString () {
    return 'ID: ' + this.id + '\n' + this.cards.join(',') + '\n\n'
  }
}

const EVENTS = { 'PLAYER_JOIN': 1, 'PLAYER_READY': 2, 'GAME_READY': 3, 'START_GAME': 4, 'SHUFFLE': 5, 'GIVE_CARD': 6, 'NEXT_PLAYER': 7, 'RAISE': 8, 'CALL_HANDS': 9, 'PLAYER_OUT': 10 }

class Game {
  constructor () {
    this.eventListeners = {}
    this.player = []
    this.ready = false
    this.toBeat = null
    this.currentPlayerID = 0
  }

  addPlayer (id, name) {
    let player = new Player(id, name)
    this.players.push(player)
    this.ready = false

    let thisGame = this
    player.ready = ready => { // Callback for ready
      player.isReady = ready
      thisGame.emit(EVENTS['PLAYER_READY'], {ready: ready, player: player.id})

      let gameReady = ready && thisGame.players.every(player => player.isReady)
      thisGame.ready = gameReady
      thisGame.emit(EVENTS['GAME_READY'], {ready: gameReady})
    }

    this.emit(EVENTS['PLAYER_JOIN'], {player: player})
    this.emit(EVENTS['GAME_READY'], { ready: false })
  }

  startGame () {
    if (!this.ready) throw new Error('Game is not ready!')
    this.shuffle()
    this.giveCards()
    this.emit(EVENTS['START_GAME'], {})
    this.playerMove(this.players[0])
  }

  playerMove (player) {
    let thisGame = this
    this.currentPlayerID = player.id
    this.emit(EVENTS['NEXT_PLAYER'],
      {
        player: player,
        toBeat: thisGame.toBeat,
        raise (constellation) {
          if (thisGame.toBeat === null || constellation.isBetterThan(thisGame.toBeat)) {
            thisGame.toBeat = constellation
            thisGame.emit(EVENTS['RAISE'], {player: player.id, constellation: constellation})
          } else throw new Error('Given constellation is not better.')
        },
        call () {

        }
      })
  }

  checkPlayers () {
    this.players.forEach(player => {
      if (player.cards.length > 5) {
        removeFromArray(this.players, player)
        this.emit(EVENTS['PLAYER_OUT'], {player: player})
      }
    })
  }

  on (type, listener) {
    if (!this.eventListeners.hasOwnProperty(type)) this.eventListeners[type] = []
    if (type === '*') {
      for (let key in EVENTS) {
        this.eventListeners[EVENTS[key]].push(event => listener(EVENTS[key], event))
      }
    } else this.eventListeners[type].push(listener)
  }

  emit (type, event) {
    // Debug
    console.log('Event ' + event + ': ' + JSON.stringify(event, null, 2))
    // End
    if (!this.eventListeners.hasOwnProperty(type)) return
    this.eventListeners[type].forEach(listener => {
      listener(event)
    })
  }

  shuffle () {
    this.deck = new Deck()
    this.emit(EVENTS['SHUFFLE'], {})
  }

  giveCards () {
    let oneMoreRound = false
    do {
      this.players.forEach(player => {
        let difference = player.numCards - player.cards.length
        oneMoreRound = oneMoreRound || difference > 1
        if (difference < 1) return
        let card = this.deck.drawCard()
        player.giveCard(card)
        this.emit(EVENTS['GIVE_CARD'], {player: player.id, card: card})
      })
    } while (oneMoreRound)
  }
}

function removeFromArray (array, item) {
  let index = array.indexOf(item)
  if (index > -1) {
    array.splice(index, 1)
  }
}

function pairCards (cards) {
  let pairs = []
  cards.forEach(card => {
    let found = false
    pairs.forEach(pair => {
      if (pair.value === card.numericalValue()) {
        pair.cards.push(card)
        found = true
      }
    })
    if (!found) pairs.push({value: card.numericalValue(), cards: [card]})
  })
  return pairs.sort((a, b) => {
    return (a.cards.length > b.cards.length || (a.cards.length === b.cards.length && a.value > b.value)) ? -1 : 1
  })
}

class Constellation {
  constructor (cards) {
    if (!Array.isArray(cards) || cards.length < 1) throw new Error('That does not work.')
    this.cards = cards
    this.calcLevel()
  }

  calcLevel () {
    let pairs = pairCards(this.cards)
    let p2 = pairs.filter(p => p.cards.length === 2)
    let p3 = pairs.filter(p => p.cards.length === 3)
    let p4 = pairs.filter(p => p.cards.length === 4)

    this.level = 1
    this.values = [pairs[0].value]

    if (p4.length > 0) {
      this.level = 6
    } else if (p3.length > 0) {
      this.level = 4
      if (p2.length > 0) {
        this.level = 5
        this.values = [p3[0].value, p2[0].value]
      }
    } else if (p2.length === 1) {
      this.level = 2
    } else if (p2.length > 1) {
      this.level = 3
      this.values = [p2[0].value, p2[1].value]
    }
  }

  isBetterThan (other) {
    if (this.level > other.level) return true
    if (this.values.length < 2) return this.values[0] > other.values[0]
    return this.values[0] > other.values[0] || (this.values[0] === other.values[0] && this.values[1] > other.values[1])
  }
}

export { Game, Constellation }
