describe('template spec', () => {
    it('userTest', function () {
        cy.visit('localhost:4200');

        cy.get('button.mat-accent span.mdc-button__label').click();
        cy.get('[name="username"]').click();
        cy.get('[name="username"]').type('test');
        cy.get('[name="password"]').type('test');
        cy.get('button.full-width').click();
        cy.get('div.avatar-wrapper').click();
        cy.get('button[mat-menu-item] mat-icon[fonticon="person"]').click();
        cy.get('button.edit-btn span.mdc-button__label').click();
        cy.get('app-edit-profile-dialog input[formcontrolname="name"]').clear().type('user');
        cy.get('app-edit-profile-dialog input[formcontrolname="email"]')
            .clear()
            .type('user@test.com');
        cy.get('app-edit-profile-dialog button.save-btn').click();
        cy.get('app-edit-profile-dialog').should('not.exist');
        cy.get('button.edit-btn span.mdc-button__label').click();
        cy.get('app-edit-profile-dialog input[formcontrolname="name"]').clear().type('test');
        cy.get('app-edit-profile-dialog input[formcontrolname="email"]')
            .clear()
            .type('test@test.com');
        cy.get('app-edit-profile-dialog button.save-btn').click();
        cy.get('mat-card.analysis-panel button.analyze-btn').should('be.visible');
        cy.get('mat-card.game-section mat-icon[fonticon="chevron_right"]').click();
        cy.get('mat-card.game-section mat-icon[fonticon="chevron_right"]').click();
        cy.get('mat-card.game-section mat-icon[fonticon="chevron_right"]').click();
        cy.get('mat-card.analysis-panel button.analyze-btn').click();
    });
});
