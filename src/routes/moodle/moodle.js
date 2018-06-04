import moodle from 'moodle-client'
import { MoodleDB } from '../../db-loki.js'

const moodleroot = 'https://elearning2.uni-heidelberg.de/'
let database = null

function getMoodleClient (token) {
  return moodle.init({
    wwwroot: moodleroot,
    token: token
  })
}

function loadUser (req, res, next) {
  if (req.session.hasOwnProperty('moodleID')) {
    try {
      let user = database.findUserByID(req.session.moodleID)
      if (user === null) {
        return res.redirect('/moodle/link')
      } else {
        getMoodleClient(user.token).then(client => {
          client.call({wsfunction: 'core_webservice_get_site_info'}).then(info => {
            // All good. User loaded
            req.user = user
            req.moodleClient = client
            return next()
          }).catch(err => {
            console.log(err)
            database.logoutUser(req.session.moodleID)
            return res.redirect('/moodle/link')
          })
        })
      }
    } catch (error) {
      next(error)
    }
  } else res.redirect('/moodle/link')
}

export default (router, config) => {
  MoodleDB.load(config.db.moodleDB).then(loaded => {
    database = loaded

    router.get('/moodle/users', (req, res, next) => {
      res.json({users: database.listUsers()})
    })

    router.get('/moodle/token', (req, res, next) => {
      if (!req.body.hasOwnProperty('token')) res.status(400).json({error: 'no_token'})

      getMoodleClient(req.body.token).then(client => {
        client.call({wsfunction: 'core_webservice_get_site_info'}).then(info => {
          // Login user / add to db
          try {
            console.log('User ' + info.userid + ' linked their moodle')
            database.loginUser(info.userid, req.body.token, info.fullname)
            req.session.moodleID = info.userid
          } catch (error) {
            console.log(error)
          }

          res.json({success: info})
        }).catch(error => {
          res.json({error: error})
        })
      }).catch(console.log)
    })

    router.get('/moodle/link', (req, res, next) => {
      req.vueOptions = {
        head: {
          title: 'Link Moodle',
          scripts: [{src: 'https://unpkg.com/axios/dist/axios.min.js'}]
        }
      }

      res.renderVue('/moodle/moodle-link.vue', {moodleroot}, req.vueOptions)
    })

    router.get('/moodle/dashboard', loadUser, (req, res) => {
      req.vueOptions = {
        head: {
          title: 'Deine Moodle-Kurse',
          scripts: [{src: 'https://unpkg.com/axios/dist/axios.min.js'}]
        }
      }
      // console.log('Opening dashboard for: ' + parseInt(req.user.id))
      req.moodleClient.call({
        wsfunction: 'core_enrol_get_users_courses',
        args: { userid: parseInt(req.user.id) }
      }).then(result => {
        let current = result.filter(course => new Date(course.enddate * 1000) > Date.now())
        let old = result.filter(course => new Date(course.enddate * 1000) < Date.now())
        res.renderVue('/moodle/dashboard.vue', {c_courses: current, o_courses: old}, req.vueOptions)
      })
    })
    router.get('/moodle/course/:courseid', loadUser, (req, res) => {
      // console.log('Loading course: ' + req.params.courseid)
      req.moodleClient.call({
        wsfunction: 'core_course_get_contents',
        args: { courseid: req.params.courseid }
      }).then(course => {
        res.json({course})
      })
    })

    router.get('/moodle/', loadUser, (req, res) => {
      res.json({user: req.user})
    })
  }).catch(error => {
    router.get('/moodle/*', (req, res, next) => {
      res.statusCode = 500

      let data = {
        debug: config.env === 'development',
        error: error
      }
      res.renderVue('error.vue', data)
    })
  })
}
