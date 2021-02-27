const config = require('./utils/config')
const logger = require('./utils/logger')
const middleware = require('./utils/middleware')
const blogRouter = require('./controllers/blogRouter')
const userRouter = require('./controllers/userRouter')
const loginRouter = require('./controllers/login')

const express = require('express')
const cors = require('cors')
const mongoose = require('mongoose')

logger.info('Connecting to', config.MONGODB_URI)
mongoose.connect(config.MONGODB_URI,
  { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false, useCreateIndex: true })
  .then(() => {
    logger.info('Connected to MongoDB')
  })
  .catch((error) => {
    logger.error('Error connecting to MongoDB:', error.message)
  })

require('express-async-errors')
const app = express()
app.use(cors())
app.use(express.static('build'))
app.use(express.json())
app.use(middleware.requestLogger)
app.use(middleware.tokenExtractor)

app.use('/api/blogs', blogRouter)
app.use('/api/users', userRouter)
app.use('/api/login', loginRouter)

if (process.env.NODE_ENV === 'test') {
  const testingRouter = require('./controllers/testing')
  app.use('/api/testing', testingRouter)
} 

app.use(middleware.unknownEndpoint)
app.use(middleware.errorHandler)

module.exports = app