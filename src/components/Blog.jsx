import { useState } from 'react'

const Blog = ({ blog, user, putLike, removeBlog }) => {
  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5
  }

  const [visible, setVisible] = useState(false)

  const hideWhenVisible = { display: visible ? 'none' : '' }
  const showWhenVisible = { display: visible ? '' : 'none' }
  const showOwnBlog = { display: user.username === blog.user.username ? '' : 'none' }

  const toggleVisibility = () => {
    setVisible(!visible)
  }

  const addLike = () => {
    const updatedBlog = {
      user: blog.user.id,
      likes: blog.likes + 1,
      author: blog.author,
      title: blog.title,
      url: blog.url
    }
    putLike(updatedBlog, blog.id)
  }

  const deleteBlog = (event) => {
    event.preventDefault()
    removeBlog(blog.id, blog.title, blog.author)
  }

  return(
    <div className='blog' style={blogStyle}>
      <div style={hideWhenVisible} className='defaultInfo'>
        {blog.title} {blog.author} <button onClick={toggleVisibility}>view</button>
      </div>
      <div style={showWhenVisible} className='togglableInfo'>
        {blog.title} {blog.author} <button onClick={toggleVisibility}>hide</button>
        <div>{blog.url}</div>
        <div>{blog.likes} <button id='like-button' onClick={addLike}>like</button></div>
        <div>{blog.user.name}</div>
        <div style={showOwnBlog}>
          <button onClick={deleteBlog}>remove</button>
        </div>
      </div>
    </div>
  )
}

export default Blog