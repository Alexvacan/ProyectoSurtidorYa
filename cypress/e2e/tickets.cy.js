describe('Ver Ticket', () => {
  it('Muestra ticket con todos los datos requeridos', () => {
    cy.visit('/');

    // Suponiendo que tienes los inputs de tipoCombustible y cantidadSolicitada
    cy.window().then((win) => {
      const conductor = new win.Presenter().conductor;
      const ticket = conductor.generarTicketDetallado({
        nombre: 'Surtidor A',
        zona: 'Cercado',
        litros: 8000,
        apertura: '08:00',
        cierre: '20:00',
      });

      expect(ticket).to.include('Surtidor: Surtidor A');
    });
  });
});
