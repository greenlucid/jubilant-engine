const mongoose = require('mongoose')
const supertest = require('supertest')
const helper = require('./user_test_helper')
const app = require('../app')

const api = supertest(app)

beforeEach( async () => {
  await helper.resetDatabase()
})

describe('POST user', () => {
  test('if missing username -> 400 + error contains username', async () => {
    const response = await api.post('/api/users')
      .expect(400)
      .expect('Content-Type', /application\/json/)
    expect(response.body).toHaveProperty('error')
    expect(response.body.error).toMatch(/username/i)
  })
  test('if username has less than 3 chars -> 400 + error contains username & characters', async () => {
    const user = {...helper.newUser, username: 'e'}
    const response = await api.post('/api/users')
      .send(user)
      .expect(400)
      .expect('Content-Type', /application\/json/)
    expect(response.body).toHaveProperty('error')
    expect(response.body.error).toMatch(/username/i)
    expect(response.body.error).toMatch(/characters/i)
  })
  test('if valid username but no pw -> 400 + error contains password', async () => {
    const user = {...helper.newUser, password: undefined}
    const response = await api.post('/api/users')
      .send(user)
      .expect(400)
      .expect('Content-Type', /application\/json/)
    expect(response.body).toHaveProperty('error')
    expect(response.body.error).toMatch(/password/i)
  })
  test('if valid username but pw is too short -> 400 + error contains password & characters', async () => {
    const user = {...helper.newUser, password: 'e'}
    const response = await api.post('/api/users')
      .send(user)
      .expect(400)
      .expect('Content-Type', /application\/json/)
    expect(response.body).toHaveProperty('error')
    expect(response.body.error).toMatch(/password/i)
    expect(response.body.error).toMatch(/characters/i)
  })
  test('if valid username and pw but username is duped -> 400 + error contains username & duplicate', async () => {
    const user = helper.userWithDuplicatedUsername
    const response = await api.post('/api/users')
      .send(user)
      .expect(400)
      .expect('Content-Type', /application\/json/)
    expect(response.body).toHaveProperty('error')
    expect(response.body.error).toMatch(/username/i)
    expect(response.body.error).toMatch(/duplicate/i)
  })
})

afterAll(() => {
  mongoose.connection.close()
})