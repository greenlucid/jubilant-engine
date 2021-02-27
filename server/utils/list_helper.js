const _ = require('lodash')

const dummy = (blogs) => {
  blogs.map(() => (1)) //Using blogs to make ESLint shut up
  return 1
}

const totalLikes = (blogs) => {
  return blogs.reduce((result, item) => (result + item.likes), 0)
}

const favoriteBlog = (blogs) => {
  if (blogs.length === 0) {
    return {}
  } else {
    const favBlog = blogs.reduce((result, item) => (
      item.likes > result.likes ? item : result
    ), {likes: -1})
    return {
      title: favBlog.title,
      author: favBlog.author,
      likes: favBlog.likes
    }
  }
}

const mostBlogs = (blogs) => {
  if (blogs.length === 0) {
    return {}
  } else {
    const authorCountDictionary = _.countBy(blogs, blog => blog.author)
    const authorAndBlogs = Object.entries(authorCountDictionary).reduce(
      (result, item) => (item[1] > result[1] ? item : result),
      ['', 0]
    )
    return({
      author: authorAndBlogs[0],
      blogs: authorAndBlogs[1]
    })
  }
}

const mostLikes = (blogs) => {
  if (blogs.length === 0) {
    return {}
  } else {
    // Sorry for implementing a low-level solution, I couldn't figure it out with lodash
    const authorLikesDictionary = blogs.reduce((result, item) => {
      result[item.author] === undefined
        ? result[item.author] = item.likes
        : result[item.author] += item.likes
      return result
    }, {})
    const authorAndLikes = Object.entries(authorLikesDictionary).reduce(
      (result, item) => (item[1] > result[1] ? item : result),
      ['', 0]
    )
    return {
      author: authorAndLikes[0],
      likes: authorAndLikes[1]
    }
  }
}

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs,
  mostLikes
}