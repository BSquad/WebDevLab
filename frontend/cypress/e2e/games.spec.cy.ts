describe('template spec', () => {
    it('passes', () => {
        cy.visit('http://localhost:4200/');
        cy.get('button.mat-accent span.mdc-button__label').click();
        cy.get('[name="username"]').click();
        cy.get('[name="username"]').type('test');
        cy.get('[name="password"]').type('test');
        cy.get('button.full-width span.mdc-button__label').click();
        cy.get('#search-title').click();
        cy.get('#search-title').type('Horizon');
        cy.get('label:nth-child(4) input.ng-valid').check();
        cy.get('div:nth-child(2) button.track-button').click();
        cy.get('div:nth-child(1) > div.game-info > div.game-title').click();
        cy.get('button.track-button').click();
        cy.get('button.normal-button').click();
        cy.get('button.back-button').click();
        cy.get('span.brand').click();
        cy.get('label:nth-child(7) input.ng-valid').check();
        cy.get('input.ng-dirty').uncheck();
    });
});
