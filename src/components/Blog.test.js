import React from 'react'
import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Blog from './Blog'

describe('<Blog/> tests', () => {
  const user = {
    username: 'test',
    name: 'test user',
    id: 'id'
  }
  const blog = {
    title: 'Component testing is done with react-testing-library',
    author: 'Tester',
    url: 'testing',
    likes: 11,
    user: user
  }

  let container
  let mockHandler

  beforeEach(() => {
    mockHandler = jest.fn()
    container = render(
      <Blog blog={blog}
        user={user}
        putLike={mockHandler}/>).container
  })

  test('renders title and author', () => {
    const div = container.querySelector('.defaultInfo')
    expect(div).not.toHaveStyle('display: none')
    screen.getAllByText('Component testing is done with react-testing-library Tester')
  })
  test('at the start other info is not shown', () => {
    const div = container.querySelector('.togglableInfo')
    expect(div).toHaveStyle('display: none')
  })
  test('renders all information when view button is pressed', async () => {

    const clicker = userEvent.setup()
    const button = screen.getByText('view')
    await clicker.click(button)

    const div = container.querySelector('.togglableInfo')
    expect(div).not.toHaveStyle('display: none')
  })
  test('liking blog twice is counted correctly', async () => {

    const clicker = userEvent.setup()
    const button = screen.getByText('view')
    await clicker.click(button)

    const likeButton = screen.getByText('like')
    await clicker.click(likeButton)
    await clicker.click(likeButton)
    expect(mockHandler.mock.calls).toHaveLength(2)
  })
})
