// Import packages and files
const express = require('express')
const db = require('./config/connection')
const routes = require('./routes')

// Define server port
const PORT = process.env.PORT || 3001

// Create the Express app
const app = express()

// Use middleware to parse incoming data, urlencoded and json
app.use(express.urlencoded({ extended: true }))
app.use(express.json())

// Use the routes defined in routes/index.js
app.use(routes)

// Connect to the MongoDB database and start the server
db.once('open', () => {
  app.listen(PORT, () => {
    console.log(`Mind-Chain server running on port ${PORT}`)
  })
})
