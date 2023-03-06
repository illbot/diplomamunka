describe('Home Login', () => {
  it('Should login', () => {
    cy.visit('http://localhost:8100/');
    cy.get('#emailInput').type('test1@test.com');
    cy.get('#passwordInput').type('testPw');
    cy.get('#loginButton').click();
  })
})
