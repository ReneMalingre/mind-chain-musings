const db = require('./../config/connection')
// Import the models
const User = require('./../models/User')
const Thought = require('./../models/Thought')

async function seedDB() {
  await User.deleteMany({})
  await Thought.deleteMany({})

  const users = await User.create([
    { username: 'Alice', email: 'alice@email.com' },
    { username: 'Bob', email: 'bob@email.com' },
    { username: 'Charlie', email: 'charlie@email.com' },
    { username: 'Danielle', email: 'danielle@email.com' },
    { username: 'Eve', email: 'eve@email.com' },
    { username: 'Frank', email: 'frank@email.com' },
    { username: 'Grace', email: 'grace@email.com' },
    { username: 'Henry', email: 'henry@email.com' },
  ])

  const thoughts = await Thought.create([
    {
      thoughtText: '⚠️⚠️ This thought will be deleted 🧨💥💣🧨💥',
      username: users[0].username,
      reactions: [
        { reactionBody: 'Me too!', username: users[1].username },
        { reactionBody: 'Coding is life.', username: users[2].username },
      ],
    },
    {
      thoughtText: 'I love coding! 😊',
      username: users[0].username,
      reactions: [
        { reactionBody: 'Me too!', username: users[1].username },
        { reactionBody: 'Coding is life.', username: users[2].username },
      ],
    },
    {
      thoughtText: 'Node.js is awesome!',
      username: users[1].username,
      reactions: [
        {
          reactionBody: 'Totally agree with you.',
          username: users[0].username,
        },
        {
          reactionBody: 'Node.js is my favorite.',
          username: users[3].username,
        },
      ],
    },
    {
      thoughtText: 'Just finished my first app! 🎉',
      username: users[2].username,
      reactions: [
        { reactionBody: 'Congratulations!', username: users[1].username },
        { reactionBody: 'Well done!', username: users[3].username },
        // eslint-disable-next-line prettier/prettier
        { reactionBody: "That's great!", username: users[0].username },
      ],
    },
    {
      thoughtText: 'Anybody else love Python? 🐍',
      username: users[3].username,
      reactions: [
        { reactionBody: 'Python is great!', username: users[2].username },
        { reactionBody: 'I prefer JavaScript.', username: users[4].username },
      ],
    },
    {
      thoughtText: 'Java or JavaScript? 🤔',
      username: users[4].username,
      reactions: [
        {
          reactionBody: 'Definitely JavaScript.',
          username: users[5].username,
        },
        { reactionBody: 'Java all the way!', username: users[6].username },
      ],
    },
    {
      thoughtText: 'Looking for good React tutorials.',
      username: users[5].username,
      reactions: [
        {
          reactionBody: 'Check out the official React docs.',
          username: users[7].username,
        },
      ],
    },
    {
      thoughtText: 'CSS is hard. 😣',
      username: users[6].username,
      reactions: [
        { reactionBody: 'You can do it!', username: users[4].username },
      ],
    },
    {
      thoughtText: 'Diving into Django. Wish me luck! 🏊‍♂️',
      username: users[7].username,
      reactions: [{ reactionBody: 'Good luck!', username: users[6].username }],
    },
  ])

  // Add thoughts to users
  for (let i = 0; i < users.length; i++) {
    await User.findByIdAndUpdate(
      users[i]._id,
      { $push: { thoughts: thoughts[i]._id } },
      { new: true, runValidators: true }
    )
  }

  // Add friends to users
  for (let i = 0; i < users.length; i++) {
    const friend1 = users[(i + 1) % users.length]._id // Next user in array, with wrap-around
    const friend2 = users[(i + 2) % users.length]._id // Two users over, with wrap-around
    await User.findByIdAndUpdate(
      users[i]._id,
      { $push: { friends: [friend1, friend2] } },
      { new: true, runValidators: true }
    )
  }

  console.log('Database seeded!')
  process.exit(0)
}
// Connect to the MongoDB database and seed the database
db.once('open', () => {
  seedDB()
})
