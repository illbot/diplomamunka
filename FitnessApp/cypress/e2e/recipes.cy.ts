import { login } from './helper/helpers';

describe('template spec', () => {
  beforeEach(()=>{
    cy.viewport('iphone-xr');
    cy.visit('http://localhost:8100/');
    login();
    cy.get('#tab-button-recipes').click();
  })

  it('Should appear some recipes', () => {
    cy.get('app-recipe-tab.ion-page > .content-ltr > ').should(($el)=>{
      expect($el.length).to.be.greaterThan(0);
    })
  })

  it('Should filter some Breakfast', ()=>{
    cy.get('#openFilterModal > .md').click();
    cy.get('.ion-padding > div > :nth-child(1)').click();
    cy.get('.ion-padding > :nth-child(7)').click();

    cy.get(':nth-child(1) > ion-card.md > ion-card-header.ion-inherit-color > ion-card-subtitle.ion-inherit-color')
      .should('have.text', 'Breakfast');
  })

  it('Should open recipe details', ()=>{
    // save first recipe's title
    let title;
    cy.get(':nth-child(1) > ion-card.md > ion-card-header.ion-inherit-color > ion-card-title.ion-inherit-color')
      .invoke('html')
      .then((html)=>{
        title = html;
        cy.get(':nth-child(1) > ion-card.md > img').click();

        // click on first elements picture
        cy.get('.can-go-back > .header-md > .toolbar-title-default > .title-default')
          .should('contain', title);

        // check if url changed
        cy.url().should('include', '/main/recipes/details');
      })
  })

  it('Should fail to create new recipe', ()=>{
    goToCreateNewRecipePage();

    // click on "upload recipe"
    cy.get('#ion-overlay-3 > .ion-page > .footer-md > ion-toolbar.md > .button').click();
    cy.get('ion-toast').not('.success').should('exist');
  })

  // I can't test the creation of the recipes, because of picture upload functionality
})

function goToCreateNewRecipePage(){
  cy.get('.fab-horizontal-end > :nth-child(1)').click();
  cy.get('.fab-list-side-top > :nth-child(1)').click();
}
