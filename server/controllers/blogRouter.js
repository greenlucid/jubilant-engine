/* eslint-disable no-unused-vars */
const blogRouter = require('express').Router()
const Blog = require('../models/blog')
const User = require('../models/user')
const logger = require('../utils/logger')
const jwt = require('jsonwebtoken')


blogRouter.get('/', async (request, response, next) => {
  const blogs = await Blog.find({}).populate('user')
  response.json(blogs)
})

blogRouter.post('/', async (request, response, next) => {
  const body = request.body

  const token = request.token
  // jwt.verify throws UnhandledRejectedPromises everywhere
  // so use try - catch and take care manually
  try {
    const decodedToken = jwt.verify(token, process.env.SECRET)
    if (body.title === undefined) {
      return response.status(400).json({ error: 'Missing title'})
    } else if (body.url === undefined) {
      return response.status(400).json({ error: 'Missing url'})
    }
    const user = await User.findById(decodedToken.id)
    const blog = new Blog({
      title: body.title,
      url: body.url,
      likes: body.likes,
      author: body.author,
      user: user._id
    })

    const postedBlog = await blog.save()
    user.blogs = user.blogs.concat(postedBlog._id)
    await user.save()
    response.status(200).json(postedBlog)
    
  } catch(error) {
    error.name = 'JsonWebTokenError'
    next(error)
  }
})

blogRouter.post('/:id/comments', async (request, response, next) => {
  const body = request.body
  const selectedBlog = await Blog.findById(request.params.id)
  const updatedFields = {
    comments: [ ...selectedBlog.comments, body.text ]
  }
  
  const newBlog = await Blog.findByIdAndUpdate(request.params.id, updatedFields, {new: true})
  response.json(newBlog)
})

blogRouter.delete('/:id', async (request, response, next) => {
  const token = request.token
  // jwt.verify throws UnhandledRejectedPromises everywhere
  // so use try - catch and take care manually
  try {
    const decodedToken = jwt.verify(token, process.env.SECRET)
    const user = await User.findById(decodedToken.id)
    const blog = await Blog.findById(request.params.id)
    if (user._id.toString() !== blog.user.toString()) {
      return response.status(401).json({ error: 'only the user that made the entry can delete it'})
    }
    await Blog.findByIdAndDelete(request.params.id)
    user.blogs = user.blogs
      .filter(id => id.toString() !== request.params.id)
    await user.save()
    response.status(204).end()
  } catch(error) {
    error.name = 'JsonWebTokenError'
    next(error)
  }
})

blogRouter.put('/:id', async (request, response, next) => {
  const updatedFields = request.body
  logger.info(updatedFields)
  const newBlog = await Blog.findByIdAndUpdate(request.params.id, updatedFields, {new: true})
  response.json(newBlog)
})

module.exports = blogRouter