describe('Ver Ticket', () => {
  it('Muestra ticket con todos los datos requeridos', () => {
    cy.visit('/');

    cy.window().then((win) => {
      const conductor = new win.Presenter().conductor;

      const ticket = conductor.generarTicket({
        nombre: 'Surtidor A',
        zona: 'Cercado',
        litros: 8000,
        apertura: '08:00',
        cierre: '20:00',
      });

      expect(ticket).to.include('Surtidor: Surtidor A');
      expect(ticket).to.include('Zona: Cercado');
      expect(ticket).to.include('Litros disponibles: 8000');
      expect(ticket).to.include('Horario: 08:00 - 20:00');
      expect(ticket).to.include('Tipo de combustible: Gasolina');
    });
  });
});

