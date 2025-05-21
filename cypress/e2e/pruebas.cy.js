describe('Generar Ticket', () => {
  beforeEach(() => {
    cy.visit('https://surtidorya.netlify.app/'); // Reemplaza con la ruta real si es necesario
  });

  it('debería agregar un ticket al hacer clic en el botón', () => {
    // Asegúrate de que el textarea esté inicialmente vacío
    cy.get('#ticket-textarea').should('have.value', '');

    // Hacer clic en el botón
    cy.get('#btn-generar-ticket').click();

    // Verificar que el ticket se haya generado con texto esperado
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
