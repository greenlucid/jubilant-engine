const User = require('../models/user')
const jwt = require('jsonwebtoken')
const logger = require('../utils/logger')

const initialUsers = [
  {username: 'Fede6', password: 'caprabo', name: 'Federico'},
  {username: 'Cyp', password: 'caprabo', name: undefined},
  {username: 's3s3s', password: 'caprabo', name: 'Sarah'},
  {username: 'E838', password: 'caprabo', name: 'Green'},
  {username: 'Calisto90', password: 'caprabo', name: 'Calisto'},
]

const newUser = {username: 'McFlanner', password: 'bobobo', name: 'Flanero'}
const userWithDuplicatedUsername = {username: 's3s3s', password: 'bobobo', name: 'Jennifer'}

const resetDatabase = async () => {
  await User.deleteMany({})
  const userObjects = initialUsers.map(user => new User(user))
  const promiseArray = userObjects.map(user => user.save())
  await Promise.all(promiseArray)
}

const usersInDb = async () => {
  const users = await User.find({})
  return users.map(user => user.toJSON())
}

const anyUser = async () => {
  const user = await User.findOne({})
  return user.toJSON()
}

const getToken = async (user) => {
  const docUser = await User.findOne({ username: user.username })
  const userForToken = {
    username: docUser.username,
    id: docUser._id
  }
  let token = null
  try {
    token = jwt.sign(userForToken, process.env.SECRET)    
  } catch(error) {
    logger.error(error)
  }
  return token
}

module.exports = {
  initialUsers,
  newUser,
  userWithDuplicatedUsername,
  resetDatabase,
  usersInDb,
  anyUser,
  getToken
}