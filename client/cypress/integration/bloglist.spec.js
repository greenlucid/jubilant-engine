import $ from 'jquery'

describe('Bloglist', function() {
  beforeEach(function() {
    cy.request('POST', 'http://localhost:3001/api/testing/reset')
    cy.visit('http://localhost:3000')
  })
  it('shows login form if unlogged', function() {
    cy.get('.loginForm').contains('Username')
    cy.get('.loginForm').contains('Password')
  })
  describe('Logging in Bloglist', function() {
    beforeEach(function() {
      cy.request('POST', 'http://localhost:3001/api/testing/reset')
      const user = {
        name: 'Jaime',
        username: 'jaimito',
        password: 'cosita'
      }
      cy.request('POST', 'http://localhost:3001/api/users', user)
      cy.visit('http://localhost:3000')
    })
    it('succeeds with correct credentials', function() {
      cy.get('.loginForm').get('#username').type('jaimito')
      cy.get('.loginForm').get('#password').type('cosita')
      cy.get('#login-button').click()
      cy.contains('Welcome Jaime')
    })
    it('fails with wrong credentials', function() {
      cy.get('.loginForm').get('#username').type('jaimito')
      cy.get('.loginForm').get('#password').type('caramelo')
      cy.get('#login-button').click()
      cy.contains('Wrong username or password')
    })
    describe('When logged in', function() {
      beforeEach(function() {
        cy.request('POST', 'http://localhost:3001/api/login', {
          username: 'jaimito', password: 'cosita'
        }).then(response => {
          localStorage.setItem('loggedBloglistUser', JSON.stringify(response.body))
          cy.visit('http://localhost:3000')
        })
      })
      it('a blog can be created', function() {
        cy.get('#blogFormTogglable').contains('Open New Blog').click()
        cy.get('#blogFormTogglable').get('.blogForm').as('blogForm')
        cy.get('@blogForm').get('#title-input').type('All about Pistachios')
        cy.get('@blogForm').get('#author-input').type('Hulk Hogan')
        cy.get('@blogForm').get('#url-input').type('https://www.youtube.com/watch?v=qYmeUc6KnHA')
        cy.get('@blogForm').get('#submitButton').click()
        cy.contains('succesfully submitted')
        cy.get('.blogList').contains('All about Pistachios').parent().as('foundBlog')
        cy.get('@foundBlog').contains('Hulk Hogan')
      })
      describe('logged and with an existing blog submitted by the user', function() {
        beforeEach(function() {
          cy.get('#blogFormTogglable').contains('Open New Blog').click()
          cy.get('#blogFormTogglable').get('.blogForm').as('blogForm')
          cy.get('@blogForm').get('#title-input').type('All about Pistachios')
          cy.get('@blogForm').get('#author-input').type('Hulk Hogan')
          cy.get('@blogForm').get('#url-input').type('https://www.youtube.com/watch?v=qYmeUc6KnHA')
          cy.get('@blogForm').get('#submitButton').click()
          cy.visit('http://localhost:3000')
        })
        it('the blog can be liked', function() {
          cy.get('.blogList').contains('All about Pistachios').parent().as('foundBlog')
          cy.get('@foundBlog').get('.detailsButton').click()
          cy.get('@foundBlog').get('.blogDetails').get('.likeButton').click()
          cy.contains('You liked All about Pistachios')
          cy.get('@foundBlog').contains('Likes: 1')
        })
        it('the blog can be deleted', function() {
          cy.get('.blogList').contains('All about Pistachios').parent().as('foundBlog')
          cy.get('@foundBlog').get('.detailsButton').click()
          cy.on('window:confirm', () => true)
          cy.get('@foundBlog').get('.removeButton').click()
          cy.contains('You deleted All about Pistachios')
          cy.get('.blogList').should('not.contain', 'All about Pistachios')
        })
      })
    })
  })
  describe('when there are multiple blogs with likes', function() {
    beforeEach(function() {
      cy.request('POST', 'http://localhost:3001/api/testing/seed')
      cy.visit('http://localhost:3000')
    })
    it('they are shown in decreasing order by likes', function() {
      //Click every button to reveal likes
      cy.get('.detailsButton').each(button => cy.wrap(button).click())
      //Store the likes in the order they appear inside an array
      let blogLikes = []
      cy.get('.blogLikes').then($blogLikes => {
        for (let i = 0; i < $blogLikes.length; i++) {
          blogLikes[i] = Number($($blogLikes[i]).text())
        }
        console.log(blogLikes)
        //Make an ordered array that is decreasing using the values of blogLikes
        const orderedLikes = blogLikes.sort((a, b) => (b - a))
        //Verify the array contains the same values
        expect(blogLikes).to.deep.equal(orderedLikes)
      })
    })
  })
})
