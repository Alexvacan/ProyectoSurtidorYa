describe('Generar Ticket', () => {
  beforeEach(() => {
    cy.visit('https://surtidorya.netlify.app/');

    cy.contains('li', 'Generar Ticket').click();

    cy.get('#ticket-gen').should('have.class', 'active');
  });

  it('debería agregar un ticket al hacer clic en el botón', () => {
    cy.get('#ticket-textarea').should('have.value', '');

    cy.get('#btn-generar-ticket').click();

    cy.get('#ticket-textarea')
      .invoke('val')
      .should('include', '🎫 Ticket generado')
      .and('include', 'Fecha:')
      .and('include', 'Hora:')
      .and('include', '-----------------------------');
  });

  it('debería agregar múltiples tickets si se hace clic varias veces', () => {
    cy.get('#btn-generar-ticket').click();
    cy.get('#btn-generar-ticket').click();

    cy.get('#ticket-textarea')
      .invoke('val')
      .then((text) => {
        const ocurrencias = text.match(/🎫 Ticket generado/g) || [];
        expect(ocurrencias).to.have.length(2);
      });
  });
});

