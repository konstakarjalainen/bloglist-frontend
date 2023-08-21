import { useState } from 'react'

const BlogForm = ({ createBlog }) => {
  const [newTitle, setTitle] = useState('')
  const [newAuthor, setAuthor] = useState('')
  const [newUrl, setUrl] = useState('')

  const addBlog = (event) => {
    event.preventDefault()
    createBlog({
      title: newTitle,
      author: newAuthor,
      url: newUrl
    })
    setTitle('')
    setAuthor('')
    setUrl('')
  }

  return(
    <div className='formDiv'>
      <h2>Create new</h2>
      <form onSubmit={addBlog}>
        <div>
          title:
          <input
            value={newTitle}
            onChange={event => setTitle(event.target.value)}
            placeholder='write title here'
          />
        </div>
        <div>
          author:
          <input
            value={newAuthor}
            onChange={event => setAuthor(event.target.value)}
            placeholder='write author here'
          />
        </div>
        <div>
          url:
          <input
            value={newUrl}
            onChange={event => setUrl(event.target.value)}
            placeholder='write url here'
          />
        </div>
        <button type='submit'>create</button>
      </form>
    </div>
  )
}

export default BlogForm