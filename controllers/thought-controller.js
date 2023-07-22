const { Thought, User } = require('../models')

// Define the ThoughtController object
// Used by the Routes
// contains methods for handling various API requests related to thoughts
const ThoughtController = {
  async thoughtsGetAll(req, res) {
    try {
      const thoughts = await Thought.find({}).select('-__v')
      res.status(200).json(thoughts)
    } catch (err) {
      res
        .status(500)
        .json({ err, message: 'An error occurred getting thoughts' })
    }
  },

  async thoughtGetById(req, res) {
    try {
      const thought = await Thought.findOne({
        _id: req.params.thoughtId,
      }).select('-__v')
      if (!thought) {
        res.status(404).json({ message: 'Thought not found' })
      } else {
        res.status(200).json(thought)
      }
    } catch (err) {
      res
        .status(500)
        .json({ err, message: 'An error occurred finding a thought' })
    }
  },

  async thoughtCreate(req, res) {
    try {
      // get the user id from the body
      const userID = req.body.userId

      if (!userID) {
        return res.status(404).json({ message: 'User not found' })
      }

      // ensure the user exists
      const userData = User.findById(userID)
      if (!userData) {
        return res.status(404).json({ message: 'User not found' })
      }

      // create the thought
      const thought = await Thought.create(req.body)

      // Add the thought to the user's thoughts array field
      await User.findOneAndUpdate(
        { _id: req.body.userId },
        { $push: { thoughts: thought._id } },
        { runValidators: true, new: true }
      )
      res.status(201).json(thought)
    } catch (err) {
      res
        .status(500)
        .json({ err, message: 'An error occurred creating a thought' })
    }
  },

  async thoughtUpdateById(req, res) {
    try {
      const thought = await Thought.findByIdAndUpdate(
        req.params.thoughtId,
        req.body,
        {
          runValidators: true,
          new: true,
        }
      )
      if (!thought) {
        res.status(404).json({ message: 'Thought not found' })
      } else {
        res.status(200).json(thought)
      }
    } catch (err) {
      res
        .status(500)
        .json({ err, message: 'An error occurred updating a thought' })
    }
  },

  async thoughtDeleteById(req, res) {
    try {
      const thought = await Thought.findByIdAndDelete({
        _id: req.params.thoughtId,
      })
      if (!thought) {
        res.status(404).json({ message: 'Thought not found' })
      } else {
        res.status(200).json({ thought, message: 'Thought deleted' })
      }
    } catch (err) {
      res
        .status(500)
        .json({ err, message: 'An error occurred deleting a thought' })
    }
  },

  async reactionCreateByThoughtId(req, res) {
    try {
      const thought = await Thought.findOneAndUpdate(
        { _id: req.params.thoughtId },
        { $addToSet: { reactions: req.body } },
        { runValidators: true, new: true }
      )
      if (thought) {
        res.status(200).json(thought)
      } else {
        res.status(404).json({ message: 'Thought not found' })
      }
    } catch (err) {
      res.status(500).json({err, message: 'An error occurred creating a reaction'})
    }
  },

  async reactionDeleteById(req, res) {
    try {
      console.log(req.params)
      console.log(req.body)
      const thought = await Thought.findOneAndUpdate(
        { _id: req.params.thoughtId },
        { $pull: { reactions: { reactionId: req.body.reactionId } } },
        { runValidators: true, new: true }
      ).select('-__v')

      if (thought) {
        res.status(200).json(thought)
      } else {
        res.status(404).json({ message: 'Thought not found' })
      }
    } catch (err) {
      res.status(500).json({err, message: 'An error occurred deleting a reaction'})
    }
  },
}

// Export ThoughtController
module.exports = ThoughtController
