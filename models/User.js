// Import the dependencies from the mongoose library
const { Schema, model } = require('mongoose')

// Define the User schema
const userSchema = new Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    // using regular expression to validate email format using match property
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      match: [
        // eslint-disable-next-line no-useless-escape
        /^([a-z0-9_\.-]+)@([\da-z\.-]+)\.([a-z\.]{2,6})$/i,
        'Please fill a valid email address',
      ],
    },
    // array of _id values referencing the User model for friends list
    friends: [
      {
        type: Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
    // array of _id values referencing the Thought model for thoughts list
    thoughts: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Thought',
      },
    ],
  },
  {
    toJSON: {
      virtuals: true, // return virtual properties when data is requested
    },
    id: false,
  }
)

// Define a virtual property 'friendCount' which returns the number of friends in the friends array
userSchema.virtual('friendCount').get(function () {
  return this.friends.length
})

// Create the User model from the userSchema
const User = model('User', userSchema)

// Exporting the User model as a module
module.exports = User
