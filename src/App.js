import { useState, useEffect, useRef } from 'react'
import Blog from './components/Blog'
import Notification from './components/Notification'
import blogService from './services/blogs'
import loginService from './services/login'
import LoginForm from './components/LoginForm'
import BlogForm from './components/BlogForm'
import Togglable from './components/Togglable'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [isError, setError] = useState(false)
  const [notification, setNotification] = useState(null)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)

  useEffect(() => {
    blogService.getAll().then(blogs =>
      setBlogs(blogs.sort((a, b) => b.likes - a.likes))
    )
  }, [])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogAppUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      console.log('User', user)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])

  const blogFormRef = useRef()

  const handleLogin = async (event) => {
    event.preventDefault()
    try {
      const user = await loginService.login({
        username, password,
      })
      window.localStorage.setItem(
        'loggedBlogAppUser', JSON.stringify(user)
      )
      blogService.setToken(user.token)
      setUser(user)
      setUsername('')
      setPassword('')
    } catch (exception) {
      setError(true)
      setNotification('wrong credentials')
      setTimeout(() => {
        setNotification(null)
        setError(false)
      }, 5000)
    }
  }

  const addBlog = async (blogObject) => {
    try {
      blogFormRef.current.toggleVisibility()
      const response = await blogService.create(blogObject)
      const addedBlog = { ...response, user: user }
      console.log('Adding blog', addedBlog)
      setBlogs(blogs.concat(addedBlog))
      setNotification(`A new blog ${addedBlog.title} by ${addedBlog.author} added`)
    } catch (error) {
      setError(true)
      setNotification(error.response.data.error)
    }
    setTimeout(() => {
      setNotification(null)
      setError(false)
    }, 6000)
  }

  const addLike = async (blogObject, id) => {
    try {
      const response = await blogService.update(id, blogObject)
      console.log('Liked blog', response)
      const oldBlog = blogs.find(blog => blog.id === id)
      const updatedBlog = { ...oldBlog, likes: oldBlog.likes + 1 }
      setBlogs(blogs.map(blog => blog.id !== id ? blog : updatedBlog))
    } catch (error) {
      setError(true)
      setNotification(error.response.data.error)
      setTimeout(() => {
        setNotification(null)
        setError(false)
      }, 6000)
    }
  }

  const deleteBlog = async (id, title, author) => {
    if (window.confirm(`Remove blog ${title} by ${author}`)) {
      try {
        await blogService.remove(id)
        setNotification(`Removed blog ${title}`)
        setBlogs(blogs.filter(blog => blog.id !== id))
      } catch (error) {
        setError(true)
        setNotification(error.response.data.error)
      }
      setTimeout(() => {
        setNotification(null)
        setError(false)
      }, 6000)
    }
  }

  const handleLogout = async (event) => {
    event.preventDefault()
    window.localStorage.removeItem('loggedBlogAppUser')
    setUser(null)
  }

  if (user === null) {
    return (
      <div>
        <Notification message={notification} isError={isError}/>
        <h2>Log in to application</h2>
        {!user &&
      <LoginForm
        username={username}
        password={password}
        handleUsernameChange={({ target }) => setUsername(target.value)}
        handlePasswordChange={({ target }) => setPassword(target.value)}
        handleSubmit={handleLogin}
      />}
      </div>
    )
  }

  return (
    <div>
      <h2>Blogs</h2>
      <Notification message={notification} isError={isError}/>
      {user && <div>
        <p>{user.name} logged in <button onClick={handleLogout}>logout</button></p>
      </div>}
      <Togglable buttonLabel='create new blog' ref={blogFormRef}>
        <BlogForm createBlog={addBlog}/>
      </Togglable>
      {blogs.map(blog =>
        <Blog key={blog.id} blog={blog} user={user} putLike={addLike} removeBlog={deleteBlog}/>
      )
      }
    </div>
  )
}

export default App