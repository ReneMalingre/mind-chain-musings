// Import the mongoose library
const mongoose = require('mongoose')

// Import the dotenv library to use environment variables
require('dotenv').config()

// Connect to the MongoDB database using the MongoDB URI provided in the environment
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})

// Export the connection to the database
module.exports = mongoose.connection
