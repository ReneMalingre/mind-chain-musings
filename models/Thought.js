const { Schema, model } = require('mongoose')
const reactionSchema = require('./Reaction')
const dayjs = require('dayjs')

// Define the Thought schema
const thoughtSchema = new Schema(
  {
    thoughtText: {
      type: String,
      required: true,
      minLength: 1,
      maxLength: 280,
    },
    createdAt: {
      type: Date,
      default: Date.now,
      get: (timestamp) =>
        dayjs(timestamp).format('DD MMM YYYY [at] hh:mm:ss a'),
    },
    username: {
      type: String,
      required: true,
    },
    reactions: [reactionSchema],
  },
  {
    toJSON: {
      getters: true,
      virtuals: true,
    },
    id: false,
  }
)

// create virtual to return the length of the thought's reactions array field on query
thoughtSchema.virtual('reactionCount').get(function () {
  return this.reactions.length
})

// Create the Thought model using the thoughtSchema
const Thought = model('Thought', thoughtSchema)

// Export the Thought model
module.exports = Thought
