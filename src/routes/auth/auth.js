import { UserDB } from '../../db-loki'

let users = null

// User middleware. Loads user into req.user for authenticated users
const userAuthMiddleware = (req, res, next) => {
  if (req.session.hasOwnProperty('userID')) {
    try {
      let user = users.findUserByID(req.session.userID)
      req.user = user === null ? undefined : user
      next()
    } catch (error) {
      next(error)
    }
  } else {
    next()
  }
}

export { userAuthMiddleware }

export default (router, config) => {
  UserDB.load(config.db.userDB).then(loaded => {
    users = loaded

    router.get('/users/list', (req, res, next) => {
      res.json({users: users.listUsers()})
    })

    router.post('/users/remove', (req, res, next) => {
      if (req.body.hasOwnProperty('email')) {
        try {
          let removed = users.removeUser(req.body.email)
          res.json({removed: removed})
        } catch (error) {
          res.statusCode = 500
          res.json({failed: error})
        }
      }
    })

    router.post('/users/add', (req, res, next) => {
      if (req.body.hasOwnProperty('email') && req.body.hasOwnProperty('pw')) {
        // TODO: check email for validity
        try {
          let user = users.createUser(req.body.email, req.body.pw)
          res.json({created: user})
        } catch (error) {
          res.statusCode = 500
          res.json({failed: error})
        }
      }
    })

    router.get('/login', (req, res, next) => {
      req.vueOptions.head.scripts.push({src: 'https://unpkg.com/axios/dist/axios.min.js'})
      res.renderVue('auth/login.vue', { user: req.user, next: req.session.next || '/home' }, req.vueOptions)
    })

    router.post('/login', (req, res, next) => {
      if (!req.body.hasOwnProperty('email') || !req.body.hasOwnProperty('pw')) return res.status(400).json({failed: 'Bad request'})
      if (req.user !== undefined) return res.status(200).json({failed: 'Already logged in'})

      let user = users.loginUser(req.body.email, req.body.pw)
      if (!user) return res.status(200).json({failed: 'Unknown email or password'})
      req.session.userID = user.id

      return res.status(200).json({success: true})
    })

    router.get('/logout', (req, res, next) => {
      if (!req.session.userID) throw new Error('You are not logged in.')
      delete req.session.userID
      res.redirect('/home')
    })
  }).catch(error => {
    router.get('/users/*', (req, res, next) => {
      res.statusCode = 500

      let data = {
        debug: config.env === 'development',
        error: error
      }
      res.renderVue('error.vue', data)
    })
  })
}
