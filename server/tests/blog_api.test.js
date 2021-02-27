const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
//const Blog = require('../models/blog')
const helper = require('./blog_test_helper')
const userHelper = require('./user_test_helper')

const api = supertest(app)

beforeEach( async () => {
  await helper.resetDatabase()
})

describe('GET', () => {
  test('to /api/blogs returns the correct amount of blogs', async () => {
    const response = 
      await api.get('/api/blogs')
        .expect(200)
        .expect('Content-Type', /application\/json/)
    const blogList = response.body

    expect(blogList.length).toEqual(helper.initialBlogs.length)
  })

  test('to /api/blogs returns blogs with id properties and no _id', async () => {
    const response = await api.get('/api/blogs', helper.newBlog)
    const blogList = response.body

    blogList.forEach(blog => {
      expect(blog).toHaveProperty('id')
      expect(blog).not.toHaveProperty('_id')
    })
  })
})

describe('POST', () => {
  test('without valid token returns 401 and error containing token', async () => {
    const token = 'pepino'

    const response = await api
      .post('/api/blogs')
      .set('Authorization', 'bearer ' + token)
      .send(helper.newBlog)
      .expect(401)
      .expect('Content-Type', /application\/json/)
    
    expect(response.body.error).toMatch(/token/i)
  })
  
  test('to /api/blogs makes blogs have an extra blog', async () => {
    const token = await userHelper.getToken(userHelper.newUser)
    
    await api
      .post('/api/blogs')
      .set('Authorization', 'bearer ' + token)
      .send(helper.newBlog)
      .expect(200)
      .expect('Content-Type', /application\/json/)
    
    const response = await api.get('/api/blogs')

    const blogsWithoutIdsAndComments = response.body.map(blog => {
      delete blog.id
      delete blog.user
      delete blog.comments
      return blog
    })

    expect(blogsWithoutIdsAndComments.length).toBe(helper.initialBlogs.length + 1)
    expect(blogsWithoutIdsAndComments).toContainEqual(helper.newBlog)
  })

  test('of a blog without likes property defaults it to 0', async () => {
    const token = await userHelper.getToken(userHelper.newUser)
    const newBlog = {...helper.newBlog, likes: undefined}

    const response = await api
      .post('/api/blogs')
      .set('Authorization', 'bearer ' + token)
      .send(newBlog)
      .expect(200)
      .expect('Content-Type', /application\/json/)
    const postedBlog = response.body

    expect(postedBlog.likes).toBe(0)
  })

  test('of a blog without title or url is 400 Bad Request and error', async () => {
    const token = await userHelper.getToken(userHelper.newUser)
    const newBlogWithoutUrl = {...helper.newBlog, url: undefined }
    const newBlogWithoutTitle = {...helper.newBlog, title: undefined }

    await api
      .post('/api/blogs')
      .set('Authorization', 'bearer ' + token)
      .send(newBlogWithoutUrl)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    await api
      .post('/api/blogs')
      .set('Authorization', 'bearer ' + token)
      .send(newBlogWithoutTitle)
      .expect(400)
      .expect('Content-Type', /application\/json/)
  })
})

describe('DELETE', () => {
  test('with no token returns 401', async () => {
    const blogToDelete = await helper.anyBlog()
    
    await api.delete(`/api/blogs/${blogToDelete.id}`)
      .expect(401)
  })
  
  test('with invalid token returns 401', async () => {
    const token = 'pepino'
    const blogToDelete = await helper.anyBlog()
    
    await api.delete(`/api/blogs/${blogToDelete.id}`)
      .set('Authorization', 'bearer ' + token)
      .expect(401)
  })

  test('returns 204 and removes an existing blog', async () => {
    const token = await userHelper.getToken(userHelper.newUser)
    const blogToDelete = await helper.anyBlog()
    
    await api.delete(`/api/blogs/${blogToDelete.id}`)
      .set('Authorization', 'bearer ' + token)
      .expect(204)
    
    const blogsAfterDelete = await helper.blogsInDb()

    expect(blogsAfterDelete).toHaveLength(helper.initialBlogs.length - 1)
    expect(blogsAfterDelete).not.toContainEqual(blogToDelete)
  })
})

describe('PUT', () => {
  test('returns 200 and new blog data', async () => {
    const blogToUpdate = await helper.anyBlog()
    const newProperties = { likes: blogToUpdate.likes + 1 }
    const expectedNewBlog = {...blogToUpdate, likes: blogToUpdate.likes + 1, user: blogToUpdate.user.toString()}
    const response = await api.put(`/api/blogs/${blogToUpdate.id}`)
      .send(newProperties)
      .expect(200)
      .expect('Content-Type', /application\/json/)

    expect(response.body).toEqual(expectedNewBlog)
  })
})

afterAll(() => {
  mongoose.connection.close()
})