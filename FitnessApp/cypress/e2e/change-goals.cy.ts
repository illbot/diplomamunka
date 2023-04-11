import { login } from './helper/helpers';

describe('template spec', () => {
  beforeEach(()=>{
    cy.viewport('iphone-xr');
    cy.visit('http://localhost:8100/');
    login();
    ToModeratelyActivityLevel();
    toMaintainGoal();
  })

  it('Should change activity level from sedentary to moderately active', () => {
    // to make sure switching from sedentary
    ToSedentaryActivityLevel();

    cy.wait(1000);

    cy.get(':nth-child(3) > p > b')
      .invoke('html')
      .then((html)=>{
        // get current value of remaining calorie
        let first_remain_Str = html;
        const first_num = parseInt(first_remain_Str.replace(/[^\d.-]/g, ''), 10);

        // navigate to change activity level
        cy.get('#tab-button-profile').click();
        cy.get('#open-modal').click();
        cy.get(':nth-child(4) > .in-item').click();

        // select activity level
        cy.get('.action-sheet-container > :nth-child(1) > :nth-child(3)').click();
        cy.get('.buttons-last-slot > .md').click();

        // navigate to home tab
        cy.get('#tab-button-home').click();
        cy.wait(1000);
        cy.get(':nth-child(3) > p > b')
          .invoke('html')
          .then((html)=>{
            let second_remain_Str = html;
            const second_num = parseInt(second_remain_Str.replace(/[^\d.-]/g, ''), 10);

            cy.wrap(second_num).should('be.gt', first_num);
          })
      });
  })

  it('Should change activity level from moderately to very active', () => {
    // to make sure switching from sedentary


    cy.get(':nth-child(3) > p > b')
      .invoke('html')
      .then((html)=>{
        // get current value of remaining calorie
        let first_remain_Str = html;
        const first_num = parseInt(first_remain_Str.replace(/[^\d.-]/g, ''), 10);

        // navigate to change activity level
        cy.get('#tab-button-profile').click();
        cy.get('#open-modal').click();
        cy.get(':nth-child(4) > .in-item').click();

        // select activity level
        cy.get('.action-sheet-container > :nth-child(1) > :nth-child(5)').click();
        cy.get('.buttons-last-slot > .md').click();

        // navigate to home tab
        cy.get('#tab-button-home').click();
        cy.wait(1000);
        cy.get(':nth-child(3) > p > b')
          .invoke('html')
          .then((html)=>{
            let second_remain_Str = html;
            const second_num = parseInt(second_remain_Str.replace(/[^\d.-]/g, ''), 10);

            cy.wrap(second_num).should('be.gt', first_num);
          })
      });
  })


  it('Should change activity level from moderately to sedentary', () => {
    // to make sure switching from sedentary

    cy.get(':nth-child(3) > p > b')
      .invoke('html')
      .then((html)=>{
        // get current value of remaining calorie
        let first_remain_Str = html;
        const first_num = parseInt(first_remain_Str.replace(/[^\d.-]/g, ''), 10);

        // navigate to change activity level
        cy.get('#tab-button-profile').click();
        cy.get('#open-modal').click();
        cy.get(':nth-child(4) > .in-item').click();

        // select activity level
        cy.get('.action-sheet-container > :nth-child(1) > :nth-child(1)').click();
        cy.get('.buttons-last-slot > .md').click();

        // navigate to home tab
        cy.get('#tab-button-home').click();
        cy.wait(1000);
        cy.get(':nth-child(3) > p > b')
          .invoke('html')
          .then((html)=>{
            let second_remain_Str = html;
            const second_num = parseInt(second_remain_Str.replace(/[^\d.-]/g, ''), 10);

            cy.wrap(second_num).should('be.lt', first_num);
          })
      });
  })


  it('Should change goal from maintain to gain-weight', () => {
    // to make sure switching from sedentary

    cy.get(':nth-child(3) > p > b')
      .invoke('html')
      .then((html)=>{
        // get current value of remaining calorie
        let first_remain_Str = html;
        const first_num = parseInt(first_remain_Str.replace(/[^\d.-]/g, ''), 10);

        // navigate to change activity level
        cy.get('#tab-button-profile').click();
        cy.get('#open-modal').click();
        cy.get(':nth-child(1) > .in-item').click();

        // select activity level
        cy.get('.action-sheet-container > :nth-child(1) > :nth-child(3)').click();
        cy.get('.buttons-last-slot > .md').click();

        // navigate to home tab
        cy.get('#tab-button-home').click();
        cy.wait(1000);
        cy.get(':nth-child(3) > p > b')
          .invoke('html')
          .then((html)=>{
            let second_remain_Str = html;
            const second_num = parseInt(second_remain_Str.replace(/[^\d.-]/g, ''), 10);

            cy.wrap(second_num).should('be.gt', first_num);
          })
      });
  })

  it('Should change goal from maintain to lose-weight', () => {
    // to make sure switching from sedentary

    cy.get(':nth-child(3) > p > b')
      .invoke('html')
      .then((html)=>{
        // get current value of remaining calorie
        let first_remain_Str = html;
        const first_num = parseInt(first_remain_Str.replace(/[^\d.-]/g, ''), 10);

        // navigate to change activity level
        cy.get('#tab-button-profile').click();
        cy.get('#open-modal').click();
        cy.get(':nth-child(1) > .in-item').click();

        // select activity level
        cy.get('.action-sheet-container > :nth-child(1) > :nth-child(1)').click();
        cy.get('.buttons-last-slot > .md').click();

        // navigate to home tab
        cy.get('#tab-button-home').click();
        cy.wait(1000);
        cy.get(':nth-child(3) > p > b')
          .invoke('html')
          .then((html)=>{
            let second_remain_Str = html;
            const second_num = parseInt(second_remain_Str.replace(/[^\d.-]/g, ''), 10);

            cy.wrap(second_num).should('be.lt', first_num);
          })
      });
  })
})

function ToSedentaryActivityLevel(){
  cy.get('#tab-button-profile').click();
  cy.get('#open-modal').click();
  cy.get(':nth-child(4) > .in-item').click();

  cy.get('.action-sheet-container > :nth-child(1) > :nth-child(1)').click();
  cy.get('.buttons-last-slot > .md').click();

  cy.get('#tab-button-home').click();
}

function ToModeratelyActivityLevel(){
  cy.get('#tab-button-profile').click();
  cy.get('#open-modal').click();
  cy.get(':nth-child(4) > .in-item').click();

  cy.get('.action-sheet-container > :nth-child(1) > :nth-child(3)').click();
  cy.get('.buttons-last-slot > .md').click();

  cy.get('#tab-button-home').click();
}

function toMaintainGoal(){
  cy.get('#tab-button-profile').click();
  cy.get('#open-modal').click();
  cy.get(':nth-child(1) > .in-item').click();

  cy.get('.action-sheet-container > :nth-child(1) > :nth-child(2)').click();
  cy.get('.buttons-last-slot > .md').click();

  cy.get('#tab-button-home').click();
}

