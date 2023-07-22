// Initialize express router
const router = require('express').Router()

const {
  thoughtsGetAll,
  thoughtGetById,
  thoughtCreate,
  thoughtDeleteById,
  thoughtUpdateById,
  reactionCreateByThoughtId,
  reactionDeleteById,
} = require('../../controllers/thought-controller')

// Define the routes for GET and POST all Thoughts
router.route('/').get(thoughtsGetAll).post(thoughtCreate)

// Define the routes for GET, PUT and DELETE Thoughts
router
  .route('/:thoughtId')
  .get(thoughtGetById)
  .put(thoughtUpdateById)
  .delete(thoughtDeleteById)

// Define the route for POST reaction to a Thought
router
  .route('/:thoughtId/reactions')
  .post(reactionCreateByThoughtId)
  .delete(reactionDeleteById)

// Export the router
module.exports = router
