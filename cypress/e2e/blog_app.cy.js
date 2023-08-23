const { func } = require("prop-types")

describe('Blog app', function() {
  beforeEach(function() {
    cy.request('POST', `${Cypress.env('BACKEND')}/testing/reset`)
    const user = {
      username: 'tester',
      name: 'Test User',
      password: 'secret'
    }
    cy.request('POST', `${Cypress.env('BACKEND')}/users`, user)
    cy.visit('')
  })
  it('Login form is shown', function() {
    cy.contains('Log in to application')
    cy.contains('login')
  })

  describe('Login', function() {
    it('succeeds with correct credentials', function() {
      cy.get('#username').type('tester')
      cy.get('#password').type('secret')
      cy.get('#login-button').click()
      cy.contains('Test User logged in')
    })

    it('fails with wrong credentials', function() {
      cy.get('#username').type('mluukkai')
      cy.get('#password').type('salainen')
      cy.get('#login-button').click()
      cy.contains('wrong credentials')
    })
  })
  describe('When logged in', function() {
    beforeEach(function() {
      cy.login({ username: 'tester', password: 'secret' })
    })
    it('A blog can be created', function() {
      cy.contains('create new blog').click()
      cy.get('#title').type('Test blog')
      cy.get('#author').type('Test Author')
      cy.get('#url').type('http://testsite.com/')
      cy.get('#create-button').click()
      cy.contains('Test blog Test Author')
    })
    describe('and blog is created', function() {
      beforeEach(function() {
        cy.createBlog({
          title: 'Test blog',
          author: 'Test Author',
          url: 'http://testsite.com/'
        })

      })
      it('A blog can be liked', function() {
        cy.contains('Test blog Test Author')
          .contains('view').click()
        cy.contains(0)
        cy.contains('like').click()
        cy.contains(1)
      })
      it('user can remove its own blog', function() {
        cy.contains('Test blog Test Author')
          .contains('view').click()
        cy.contains('remove').click()
        cy.contains('Test blog Test Author').should('not.exist')
      })
      it('user can not remove blog by other user', function() {
        const user2 = {
          username: 'tester2',
          name: 'Test User2',
          password: 'secret'
        }
        cy.request('POST', `${Cypress.env('BACKEND')}/users`, user2)
        cy.visit('')
        cy.contains('logout').click()
        cy.login({ username: 'tester2', password: 'secret' })
        cy.contains('Test blog Test Author')
          .contains('view').click()
        cy.contains('remove').should('not.be.visible')
      })
      it('blogs ordered from most likes to least', function() {
        cy.createBlog({
          title: 'Test blog 2',
          author: 'Test Author 2',
          url: 'http://testsite2.com/'
        })
        cy.createBlog({
          title: 'Test blog 3',
          author: 'Test Author 3',
          url: 'http://testsite3.com/'
        })
        cy.contains('Test blog Test Author')
          .contains('view').click()
        cy.contains('Test blog 2 Test Author 2')
          .contains('view').click()
        cy.contains('Test blog 3 Test Author 3')
          .contains('view').click()

        cy.contains('Test blog 3 Test Author 3').parent().find('#like-button').as('button3')
        cy.get('@button3').click()

        cy.get('@button3').click()

        cy.get('@button3').click()


        cy.contains('Test blog 2 Test Author 2').parent().find('#like-button').as('button2')
        cy.get('@button2').click()

        cy.get('@button2').click()


        cy.contains('Test blog Test Author').parent().find('#like-button').as('button1')
        cy.get('@button1').click()


        cy.get('.blog').eq(0).should('contain', 'Test blog 3')
        cy.get('.blog').eq(1).should('contain', 'Test blog 2')
        cy.get('.blog').eq(2).should('contain', 'Test blog')

      })
    })
  })
})