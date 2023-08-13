const loginForm = (props) => {
  return(
    <form onSubmit={props.onSubmit}>
      <div>
        username
        <input
          type="text"
          value={props.username}
          name="Username"
          onChange={props.usernameOnChange}
        />
      </div>
      <div>
        password
        <input
          type="password"
          value={props.password}
          name="Password"
          onChange={props.passwordOnChange}
        />
      </div>
      <button type="submit">login</button>
    </form>      
  )
}

export default loginForm