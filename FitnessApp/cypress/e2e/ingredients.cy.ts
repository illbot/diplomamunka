import { login } from './helper/helpers';

describe('Ingredients', () => {
  beforeEach(()=>{
    cy.viewport('iphone-xr');
    cy.visit('http://localhost:8100/');
    login();
    cy.get('#tab-button-ingredients').click();
  })

  it('Should appear some ingredients', () => {
    cy.get('.content-ltr > .list-md >').should(($el)=>{
      expect($el.length).to.be.greaterThan(2);
    })
  })

  it('Should fail to add new ingredient', () => {
    // Navigate to add new ingredient modal
    cy.get('.fab-horizontal-end > .ion-activatable > .md').click();

    // Click on upload
    cy.get('#ion-overlay-2 > .ion-page > .footer-md > ion-toolbar.md > .button').click();

    // Check for error toast
    cy.get('ion-toast').not('.success').should('exist');
  })

  it('Should successfully add new ingredient', ()=>{
    let testIngredientName = 'TestIngredientApple';

    // Navigate to add new ingredient modal
    cy.get('.fab-horizontal-end > .ion-activatable > .md').click();

    // Upload with data
    // Apple, 100g, 52 kcal, 0.3 protein , 11.4 ch, 0.2 fat
    cy.get('.ion-padding > :nth-child(2) > .ng-untouched > .native-input')
      .type(testIngredientName);
    cy.get(':nth-child(1) > .item-interactive > .ng-untouched > .native-input')
      .type('100');
    cy.get('.segment-button-checked').click();

    // fat
    cy.get(':nth-child(4) > :nth-child(2) > .ng-untouched > .native-input')
      .type('0.2');
    // Protein
    cy.get(':nth-child(3) > .ng-untouched > .native-input')
      .type('0.3');
    // Ch
    cy.get(':nth-child(4) > .ng-untouched > .native-input')
      .type('11.4');

    cy.get(':nth-child(5) > .item-interactive > .ng-untouched > .native-input')
      .type('52');

    cy.get('#ion-overlay-2 > .ion-page > .footer-md > ion-toolbar.md > .button').click();

    cy.get('ion-toast').not('danger').should('exist');

  })

})

