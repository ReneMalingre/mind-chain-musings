// Init router
const router = require('express').Router()
const apiRoutes = require('./api-routes')

// point to api routes
router.use('/api', apiRoutes)

// when all else fails...
router.use((req, res) => {
  return res.status(404).send('Not found')
})

module.exports = router
