import { login } from './helper/helpers';

describe('template spec', () => {
  beforeEach(()=>{
    cy.viewport('iphone-xr');
    cy.visit('http://localhost:8100/');
    login();
  })

  it('should pass', ()=>{
    cy.wait(2000);
    cy.get(':nth-child(1) > p > b')
      .invoke('html')
      .then((html)=>{
        // get current value of remaining calorie
        let first_remain_Str = html;
        const first_num = parseInt(first_remain_Str.replace(/[^\d.-]/g, ''), 10);

        // switch to recipes tab
        cy.get('#tab-button-recipes').click();

        // Filter for a food, that has calorie associated with
        cy.get('#openFilterModal > .md').click();
        cy.get('.ng-untouched > .native-input').type('Test recipe');
        cy.get('.ion-padding > :nth-child(7)').click();

        cy.wait(1000);
        // click on eat
        cy.get('ion-card.md > :nth-child(5)').click(5,5);

        // switch back to home tab
        cy.get('#tab-button-home').click();
        cy.wait(1000);
        cy.get(':nth-child(1) > p > b')
          .invoke('html')
          .then((html)=>{
            let second_remain_Str = html;
            const second_num = parseInt(second_remain_Str.replace(/[^\d.-]/g, ''), 10);

            cy.wrap(second_num).should('be.lt', first_num);
          });
      });
  })
})

