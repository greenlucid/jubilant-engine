const testingRouter = require('express').Router()
const Blog = require('../models/blog')
const User = require('../models/user')
const blogHelper = require('../tests/blog_test_helper')

testingRouter.post('/reset', async (request, response) => {
  await Blog.deleteMany({})
  await User.deleteMany({})

  response.status(204).end()
})
testingRouter.post('/seed', async (request, response) => {
  await blogHelper.resetDatabase()

  response.status(204).end()
})

module.exports = testingRouter