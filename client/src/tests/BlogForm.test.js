import React from 'react'
import '@testing-library/jest-dom/extend-expect'
import { render, fireEvent } from '@testing-library/react'
import BlogForm from '../components/BlogForm'

describe('BlogForm', () => {
  let component
  let mockHandler
  const blog = {
    title: 'Ping Pong is bad for you - This is Why',
    author: 'Eric Andre',
    url: 'https://ididntchoosetobeajournalist.com/blogs/Ping-Pong'
  }
  const user = {
    username: 'Semver',
    name: 'Semas'
  }
  beforeEach(() => {
    mockHandler = jest.fn()
    component = render(<BlogForm user={user} postHandler={mockHandler}/>)
  })
  test('calls the event handler with the right details', () => {
    const form = component.container.querySelector('.blogForm')
    const authorField = form.querySelector('[name="Author"]')
    const titleField = form.querySelector('[name="Title"]')
    const urlField = form.querySelector('[name="Url"]')

    fireEvent.change(authorField, {
      target: { value: blog.author }
    })
    fireEvent.change(titleField, {
      target: { value: blog.title }
    })
    fireEvent.change(urlField, {
      target: { value: blog.url }
    })
    fireEvent.submit(form)
    expect(mockHandler.mock.calls).toHaveLength(1)
    //BlogForm feeds the 'blog' state directly to the service when submitting. I cannot access state
    //So as I wanted to compare what was being submitted, I had to patch it up in an ugly way in BlogForm.
    //You can see it in 'handleBlogPost' related to 'postHandler'. I didn't make it testable, had I known!
    expect(mockHandler.mock.calls[0][0]).toEqual(blog)
  })
})