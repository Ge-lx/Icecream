import Loki from 'lokijs'
import crypto from 'crypto'
import project from './util/project.js'

let stripInternals = {except: ['salt', 'hash', 'meta'], move: {'$loki': 'id'}}

function loadFromFile (filename, options) {
  return new Promise((resolve, reject) => {
    let loki
    if (options === undefined) {
      options = {
        verbose: true,
        autosave: true,
        autosaveInterval: 4000
      }
    }
    options.autoload = true
    options.autoloadCallback = () => resolve(loki)

    loki = new Loki(filename, options)
  })
}

class MoodleDB {
  static load (filename) {
    return loadFromFile(filename).then(loki => new MoodleDB(loki))
  }

  constructor (loki) {
    const options = {
      unique: ['id'],
      indices: ['id'],
      disableMeta: true
    }

    this.loki = loki.getCollection('moodle')
    if (this.loki === null) this.loki = loki.addCollection('moodle', options)
  }

  loginUser (userID, token, name) {
    let user = this.loki.by('id', userID)
    if (!user) {
      user = {id: userID, token: token, name: name}
      this.insertUser(user)
    } else {
      user.token = token
      this.updateUser(user)
    }
    return user
  }

  logoutUser (userID) {
    let user = this.loki.by('id', userID)
    if (user === null) { return false }
    delete user.token
    this.updateUser(user)
    return true
  }

  insertUser (user, projection = null) {
    return project(this.loki.insert(user), projection)
  }

  updateUser (user, projection = null) {
    return project(this.loki.update(user), projection)
  }

  removeUser (email, projection = null) {
    return this.loki.findAndRemove({email: email})
  }

  findUserByID (id, projection = null) {
    return project(this.loki.by('id', id), projection)
  }
}

class UserDB {
  static load (filename) {
    return loadFromFile(filename).then(loki => new UserDB(loki))
  }

  constructor (loki) {
    const options = {
      unique: ['email'],
      indices: ['id', 'email']
    }
    this.loki = loki.getCollection('users')
    if (this.loki === null) this.loki = loki.addCollection('users', options)
  }

  createUser (email, password, projection = stripInternals) {
    crypto.DEFAULT_ENCODING = 'hex'
    let salt = crypto.randomBytes(128).toString('hex')
    let hash

    hash = crypto.pbkdf2Sync(password, salt, 100000, 512, 'sha512')

    return this.insertUser({
      email: email,
      salt: salt,
      hash: hash
    }, projection)
  }

  insertUser (user, projection = stripInternals) {
    return project(this.loki.insert(user), projection)
  }

  updateUser (user, projection = stripInternals) {
    return project(this.loki.update(user), projection)
  }

  removeUser (email, projection = stripInternals) {
    return this.loki.findAndRemove({email: email})
  }

  findUserByID (id, projection = stripInternals) {
    return project(this.loki.get(id, false), projection)
  }

  findUserByEmail (email, projection = stripInternals) {
    return project(this.loki.findOne({email: email}), projection)
  }

  listUsers (projection = stripInternals) {
    return project(this.loki.chain().where(obj => true).data(), projection)
  }

  loginUser (email, password) {
    let user = this.findUserByEmail(email, {except: []})
    if (user === null) return false
    crypto.DEFAULT_ENCODING = 'hex'
    let hash = crypto.pbkdf2Sync(password, user.salt, 100000, 512, 'sha512')
    if (user.hash !== hash) return false
    // if (sessionID) {
    //   let sessions = user.sessions || []
    //   sessions.push(sessionID)
    //   user.sessions = sessions
    //   this.updateUser(user)
    // }
    return project(user, stripInternals)
  }

  // logoutUser (id, sessionID) {
  //   let user = this.findUserByID(id, {except: []})
  //   if (user === null) throw new Error('Cannot find user with id: ' + id)
  //   if (!user.sessions || !user.sessions.includes(sessionID)) {
  //     throw new Error('Cannot find sessionID on ' + user.email)
  //   } else {
  //     user.sessions = user.sessions.filter(sid => sid !== sessionID)
  //     this.updateUser(user)
  //   }
  // }

  // changePasswort(email, newPassword)
}

module.exports = { UserDB, MoodleDB }
