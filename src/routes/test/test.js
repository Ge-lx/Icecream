import crypto from 'crypto'

export default (router) => {
  router.get('/test', (req, res, next) => {
    const data = {
      random: crypto.randomBytes(16).toString('hex'),
      clientIP: req.hostname
    }

    req.vueOptions = {
      head: {
        title: 'Random test'
      }
    }

    res.renderVue('test/test.vue', data, req.vueOptions)
  })
}
