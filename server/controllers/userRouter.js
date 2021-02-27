/* eslint-disable no-unused-vars */
const userRouter = require('express').Router()
const User = require('../models/user')
const bcrypt = require('bcryptjs')

userRouter.get('/', async (request, response, error) => {
  const users = await User.find({}).populate('blogs')
  response.json(users)
})

userRouter.post('/', async (request, response, error) => {
  const body = request.body
  if (!body) {
    return response.status(400).json({ error: 'Body is missing' })
  } else if (!body.username) {
    return response.status(400).json({ error: 'Username is missing' })
  } else if (body.username.length < 3) {
    return response.status(400).json({ error: 'Username needs to be 3 characters minimum' })
  } else if (!body.password) {
    return response.status(400).json({ error: 'Password is missing' })
  } else if (body.password.length < 3) {
    return response.status(400).json({ error: 'Password needs to be 3 characters minimum' })
  }
  const duplicateUsers = await User.find({username: body.username})
  if (duplicateUsers.length !== 0) {
    return response.status(400).json({ error: 'Username is a duplicate' })
  }

  const saltRounds = 10
  const passwordHash = await bcrypt.hash(body.password, saltRounds)

  const user = new User({
    username: body.username,
    passwordHash,
    name: body.name
  })

  const savedUser = await user.save()

  response.json(savedUser)
})

userRouter.delete('/:id', async (request, response, error) => {
  await User.findByIdAndDelete(request.params.id)
  response.status(204).end()
})

module.exports = userRouter