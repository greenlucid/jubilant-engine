import React, { useState } from 'react'
import blogService from '../services/blogs'

const BlogForm = ({ user, blogs, setBlogs, showMessage, blogToggleRef, postHandler }) => {
  const blankForm = { title: '', author: '', url: '' }
  const [blog, setBlog] = useState(blankForm)

  const emptyFields = () => {
    setBlog(blankForm)
  }

  const handleBlogPost = async (event) => {
    event.preventDefault()
    if (postHandler) {
      postHandler(blog)
    } else {
      try {
        const postedBlog = await blogService.create(blog, user.token)
        showMessage(`Blog "${blog.title}" was succesfully submitted`)
        blogToggleRef.current.toggleVisibility()
        setBlogs(blogs.concat(postedBlog))
        emptyFields()

      } catch(error) {
        showMessage('There was a problem in submitting the blog')
      }
    }
  }
  if (!user) {
    return (<div>You need to log in before posting a new blog</div>)
  } else {
    return (
      <div>
        <form className='blogForm' onSubmit={handleBlogPost}>
          <div>
            title:
            <input
              value={blog.title}
              type='text'
              name='Title'
              id='title-input'
              onChange={({ target }) => {
                setBlog({ ...blog, title: target.value })
              }}
            />
          </div>
          <div>
            author:
            <input
              value={blog.author}
              type='text'
              name='Author'
              id='author-input'
              onChange={({ target }) => {
                setBlog({ ...blog, author: target.value })
              }}
            />
          </div>
          <div>
            url:
            <input
              value={blog.url}
              type='text'
              name='Url'
              id='url-input'
              onChange={({ target }) => {
                setBlog({ ...blog, url: target.value })
              }}
            />
          </div>
          <button name='submitButton' id='submitButton' type="submit">Submit</button>
        </form>
      </div>
    )
  }
}

export default BlogForm