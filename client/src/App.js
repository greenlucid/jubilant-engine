import React, { useState, useEffect, useRef } from 'react'
import Blog from './components/Blog'
import Togglable from './components/Togglable'
import LoginForm from './components/LoginForm'
import BlogForm from './components/BlogForm'
import blogService from './services/blogs'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [user, setUser] = useState(null)
  const [errorMessage, setErrorMessage] = useState(null)

  const blogToggleRef = useRef()
  const loginToggleRef = useRef()

  useEffect(() => {
    blogService.getAll().then(blogs =>
      setBlogs( blogs.sort((a, b) => (b.likes - a.likes)) )
    )
  }, [])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBloglistUser')
    if (loggedUserJSON) {
      setUser(JSON.parse(loggedUserJSON))
    } else {
      loginToggleRef.current.toggleVisibility()
    }
  }, [errorMessage])

  const showMessage = (message) => {
    setErrorMessage(message)
    setTimeout(() => {
      setErrorMessage(null)
    }, 5000)
  }

  return (
    <div>
      {errorMessage !== null && <h3>{errorMessage}</h3>}
      <Togglable buttonLabel="Login" ref={loginToggleRef} id='loginTogglable'>
        <LoginForm user={user} setUser={setUser} showMessage={showMessage}/>
      </Togglable>
      <br/>
      <Togglable buttonLabel="New Blog" ref={blogToggleRef} id='blogFormTogglable'>
        <BlogForm user={user} blogs={blogs} setBlogs={setBlogs} showMessage={showMessage}
          blogToggleRef={blogToggleRef}
        />
      </Togglable>
      <h2>blogs</h2>
      <div className='blogList'>
        {blogs.map(blog =>
          <Blog key={blog.id} blog={blog} blogs={blogs} setBlogs={setBlogs}
            user={user} showMessage={showMessage}
          />
        )}
      </div>
    </div>
  )
}

export default App