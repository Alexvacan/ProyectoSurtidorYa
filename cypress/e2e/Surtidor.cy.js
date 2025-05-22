describe('Agregar Surtidor', () => {
  beforeEach(() => {
    cy.visit('https://surtidorya.netlify.app/');
  });

  it('debería agregar un nuevo surtidor correctamente', () => {
    cy.get('#nombre').type('Surtidor Test');
    cy.get('#direccion').type('Av. de Prueba 123');
    cy.get('#estado').select('Disponible');
    cy.get('#fila').type('5');
    cy.get('#zona').select('Cercado');
    cy.get('#litros').type('500');
    cy.get('#apertura').type('08:00');
    cy.get('#cierre').type('18:00');
    cy.get('#contacto').type('71234567');

    cy.get('#form-surtidor').submit();

    cy.get('#lista-surtidores')
      .should('contain.text', 'Surtidor Test')
      .and('contain.text', 'Disponible')
      .and('contain.text', 'Cercado');
  });
});
