const listHelper = require('../utils/list_helper')
const blogs = require('./blog_test_helper').initialBlogs

test('Dummy returns one', () => {
  const result = listHelper.dummy(blogs)
  expect(result).toBe(1)
})

describe('Total likes', () => {
  const totalLikes = listHelper.totalLikes

  test('when blogs is empty, is zero', () => {
    expect(totalLikes([])).toBe(0)
  })

  test('when blogs only has one blog, equals the likes of that blog', () => {
    expect(totalLikes([blogs[0]])).toBe(blogs[0].likes)
  })

  test('when blogs has more than one blog, is equal to the sum of their likes', () => {
    expect(totalLikes(blogs)).toBe(36) //Hardcoded
  })
})

describe('Favorite blog', () => {
  const favoriteBlog = listHelper.favoriteBlog

  test('when blogs is empty, is empty object', () => {
    expect(favoriteBlog([])).toEqual({})
  })

  test('when blogs only has one blog, equals that blog', () => {
    expect(favoriteBlog([blogs[0]])).toEqual({
      title: blogs[0].title,
      author: blogs[0].author,
      likes: blogs[0].likes
    })
  })

  test('when blogs has more than one blog, is {blog with more likes, author, likes}', () => {
    expect(favoriteBlog(blogs)).toEqual({
      title: 'Canonical string reduction',
      author: 'Edsger W. Dijkstra',
      likes: 12
    }) // Hardcoded
  })
})

describe('Most blogs', () => {
  const mostBlogs = listHelper.mostBlogs

  test('when blogs is empty, is empty object', () => {
    expect(mostBlogs([])).toEqual({})
  })

  test('when blogs has more than one blog, is {any author with max blogs, their blogs}', () => {
    expect(mostBlogs(blogs)).toEqual({
      author: 'Robert C. Martin',
      blogs: 3
    }) // Hardcoded
  })
})

describe('Most likes', () => {
  const mostLikes = listHelper.mostLikes

  test('when blogs is empty, is empty object', () => {
    expect(mostLikes([])).toEqual({})
  })

  test('when blogs has more than one blog, is {any author with max likes, their likes}', () => {
    expect(mostLikes(blogs)).toEqual({
      author: 'Edsger W. Dijkstra',
      likes: 17
    }) // Hardcoded
  })
})