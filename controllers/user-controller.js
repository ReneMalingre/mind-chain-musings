const { User, Thought } = require('../models')

// Define the UserController object
// Used by the Routes
// contains methods for handling various API requests related to Users
const UserController = {
  async usersGetAll(req, res) {
    try {
      const userData = await User.find({}).select('-__v')
      res.json(userData)
    } catch (err) {
      res.status(500).json({ err, message: 'Could not retrieve the users' })
    }
  },

  async usersGetAll_Populated(req, res) {
    try {
      const userData = await User.find({})
        .select('-__v')
        .populate('thoughts')
        .populate('friends')
      res.json(userData)
    } catch (err) {
      res.status(500).json({ err, message: 'Could not retrieve the users' })
    }
  },

  async userGetById(req, res) {
    try {
      const userData = await User.findById(req.params.userId)
        .select('-__v')
        .populate('thoughts')
        .populate('friends')
      res.json(userData)
    } catch (err) {
      res.status(404).json({ err, message: 'Could not find user with this id' })
    }
  },

  async userCreate(req, res) {
    try {
      const userData = await User.create(req.body)
      res.json(userData)
    } catch (err) {
      res.status(500).json({ err, message: 'Could not create user' })
    }
  },

  async userUpdateById(req, res) {
    try {
      // find the user
      const userData = await User.findById(req.params.id)
      if (!userData) {
        return res.status(404).json({ message: 'User not found' })
      }
      // Remember the old username
      const oldUsername = userData.username

      // get the body data
      const { username, email } = req.body

      // validate the data
      if (!username || !email) {
        return res
          .status(400)
          .json({ message: 'Username and email are required' })
      }

      // if the username has been provided and it is different from the old username, update the user
      let changeUserName = false
      if (username) {
        if (username !== oldUsername) {
          // check if the username is already taken
          changeUserName = true
          userData.username = username
        }
      }

      // if the email has been provided, update the user
      if (email) {
        userData.email = email
      }

      // Update the user
      await userData.save()

      // If the username has changed, update the username in the thoughts
      if (changeUserName) {
        // Update username in all associated thoughts
        await Thought.updateMany(
          { username: oldUsername },
          { username: req.body.username },
          { runValidators: true, new: true }
        )
      }

      res.status(200).json({ userData, message: 'User updated successfully' })
    } catch (err) {
      res.status(500).json({ err, message: 'An error occurred updating user' })
    }
  },

  async userDeleteById(req, res) {
    try {
      const userData = await User.findOne({ _id: req.params.userId })

      if (!userData) {
        return res.status(404).json({ message: 'User not found' })
      }

      // Remove the thoughts that this user has created
      try {
        await Thought.deleteMany({ username: userData.username })
      } catch (err) {
        console.error(err)
      }

      // Remove the user from any friends arrays
      try {
        await User.updateMany(
          { friends: userData._id },
          { $pull: { friends: userData._id } },
          { runValidators: true, new: true }
        )
      } catch (err) {
        console.error(err)
      }

      // Then delete the user
      await User.deleteOne({ _id: req.params.userId })

      // return success
      res.status(200).json({ message: 'User deleted successfully' })
    } catch (err) {
      res.status(500).json({ err, message: 'An error occurred deleting user' })
    }
  },

  async friendAddLink(req, res) {
    try {
      const userData = await User.findOneAndUpdate(
        { _id: req.params.userId },
        { $addToSet: { friends: req.body.friendId || req.params.friendId } },
        { new: true , runValidators: true}
      )
      if (!userData) {
        return res.status(404).json({ message: 'User not found' })
      }
      res.json(userData)
    } catch (err) {
      res.status(500).json({ err, message: 'An error occurred adding friend' })
    }
  },

  async friendRemoveLink({ params }, res) {
    try {
      const dbUserData = await User.findOneAndUpdate(
        { _id: params.userId },
        { $pull: { friends: params.friendId } },
        { new: true, runValidators: true }
      )
      if (!dbUserData) {
        return res.status(404).json({ message: 'No User with this id' })
      }
      // check if user was removed
      const removed = !dbUserData.friends.includes(params.friendId)
      // return response with appropriate message
      if (removed) {
        res.json({
          message: 'Friend removed from Friend List successfully',
          dbUserData,
        })
      } else {
        res.json(dbUserData)
      }
    } catch (err) {
      res
        .status(400)
        .json({ err, message: 'An error occurred removing friend' })
    }
  },
}

// Export UserController
module.exports = UserController
