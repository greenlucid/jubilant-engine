import React from 'react'
import '@testing-library/jest-dom/extend-expect'
import { render, fireEvent } from '@testing-library/react'
import Blog from '../components/Blog'

describe('Blog', () => {
  let component
  let mockHandler
  const blog = {
    title: 'Ping Pong is bad for you - This is Why',
    author: 'Eric Andre',
    url: 'https://ididntchoosetobeajournalist.com/blogs/Ping-Pong',
    likes: 0,
    user: {
      username: 'pepiner',
      name: 'Pepino Man'
    }
  }
  const user = {
    username: 'Semver',
    name: 'Semas'
  }
  beforeEach(() => {
    mockHandler = jest.fn()
    component = render(<Blog blog={blog} user={user} likeHandler={mockHandler}/>)
  })

  test('renders title', () => {
    expect(component.container).toHaveTextContent(blog.title)
  })

  test('renders author', () => {
    expect(component.container).toHaveTextContent(blog.author)
  })

  test('does not render details by default', () => {
    const blogDetails = component.container.querySelector('.blogDetails')
    expect(blogDetails).toBeNull()
  })

  test('renders details when view button is clicked', () => {
    const button = component.container.querySelector('.detailsButton')
    fireEvent.click(button)
    const blogDetails = component.container.querySelector('.blogDetails')
    expect(blogDetails).not.toBeNull()
    expect(blogDetails).toHaveTextContent(blog.url)
    expect(blogDetails).toHaveTextContent(blog.likes)
  })

  test('clicking like twice calls handleLike twice', () => {
    const button = component.container.querySelector('.detailsButton')
    fireEvent.click(button)
    const likeButton = component.container.querySelector('.likeButton')
    fireEvent.click(likeButton)
    fireEvent.click(likeButton)
    expect(mockHandler.mock.calls).toHaveLength(2)
  })
})