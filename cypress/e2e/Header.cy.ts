describe('Header Component Tests', () => {
    beforeEach(() => {
        cy.visit('http://localhost:4321/'); // Adjust the URL based on your application
    });

    it('should display the header and navbar correctly', () => {
        cy.get('#navbar-container').should('be.visible');
        cy.get('#full-name-wrapper').contains('Seridi Mohammed Bachir').should('be.visible');
        cy.get('#links-container a').should('have.length', 3);

        // Check links
        cy.get('#links-container a').eq(0).should('have.attr', 'href', '/');
        cy.get('#links-container a').eq(1).should('have.attr', 'href', '/project');
        cy.get('#links-container a').eq(2).should('have.attr', 'href', '/about');
    });

    it('should show and hide the sidebar when toggling buttons', () => {
        // Sidebar should not be visible initially
        cy.get('#side-bar').should('not.be.visible');

        // Check open button visibility on small screens
        cy.viewport(425, 800); // Mobile viewport
        cy.get('#open-btn').should('be.visible').click();

        // Sidebar should now be visible
        cy.get('#side-bar').should('be.visible');

        // Close the sidebar
        cy.get('#close-btn').should('be.visible').click();
        cy.get('#side-bar').should('not.be.visible');
    });

    it('should hide desktop elements on small screens', () => {
        cy.viewport(425, 800);

        // Desktop elements should not be visible
        cy.get('#links-container').should('not.be.visible');
        cy.get('#contact-button').should('not.be.visible');
    });
});
