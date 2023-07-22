// Schema only - it is used as the reaction field's sub-document schema in the Thought model
const { Schema, Types } = require('mongoose')
const dayjs = require('dayjs')

// Define the Reaction schema
const reactionSchema = new Schema(
  {
    reactionId: {
      type: Schema.Types.ObjectId,
      default: () => new Types.ObjectId(),
    },
    reactionBody: {
      type: String,
      required: true,
      maxLength: 280,
    },
    username: {
      type: String,
      required: true,
    },
    createdAt: {
      type: Date,
      default: Date.now,
      get: (timestamp) =>
        dayjs(timestamp).format('DD MMM YYYY [at] hh:mm:ss a'),
    },
  },
  {
    toJSON: {
      getters: true,
    },
    id: false,
  }
)

module.exports = reactionSchema
