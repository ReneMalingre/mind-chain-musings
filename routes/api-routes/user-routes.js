// Import the dependencies and controllers functions for the user routes
const router = require('express').Router()
const {
  usersGetAll,
  usersGetAllPopulated,
  userGetById,
  userCreate,
  userUpdateById,
  userDeleteById,
  friendAddLink,
  friendRemoveLink,
} = require('../../controllers/user-controller')

// Users routes (get all and create)
router.route('/').get(usersGetAll).post(userCreate)

// Users route with populated thoughts and friends (bonus)
router.route('/populated').get(usersGetAllPopulated)

// Single user routes
router
  .route('/:userId')
  .get(userGetById) // has friends and thoughts populated
  .put(userUpdateById)
  .delete(userDeleteById)

// Friend link routes
router
  .route('/:userId/friends/:friendId')
  .post(friendAddLink)
  .delete(friendRemoveLink)

// Export the router
module.exports = router
