import { login } from './helper/helpers';

describe('Authentication', () => {
  beforeEach(()=>{
    cy.viewport('iphone-xr');
    cy.visit('http://localhost:8100/');
  })

  it('Should login', () => {
    login();
    cy.url().should('include', '/main/home');
  })

  it('Should logout', () =>{
    login();
    cy.get('#tab-button-profile').click();
    cy.get('.ion-color').click();
    cy.url().should('include', '/');
  })
})


