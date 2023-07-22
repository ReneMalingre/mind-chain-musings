// bring in express router
const router = require('express').Router()

const userRoutes = require('./user-routes')
const thoughtRoutes = require('./thought-routes')

// Link endpoints for user and thought routes
router.use('/users', userRoutes)
router.use('/thoughts', thoughtRoutes)

// Export the router
module.exports = router
