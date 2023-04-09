
export function login(){
  cy.get('#emailInput').type('test1@test.com');
  cy.get('#passwordInput').type('testPw');
  cy.get('#loginButton').click();
}
