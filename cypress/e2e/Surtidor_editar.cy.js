describe('Editar surtidor', () => {
  beforeEach(() => {
    cy.visit('http://localhost:1234');
  });

  it('Debería editar un surtidor existente', () => {

    cy.get('#nombre').type('Surtidor Test');
    cy.get('#direccion').type('Av. Siempre Viva 123');
    cy.get('#estado').select('Disponible');
    cy.get('#fila').type('5');
    cy.get('#zona').select('Cercado');
    cy.get('#litros').type('1000');
    cy.get('#apertura').type('06:00');
    cy.get('#cierre').type('18:00');
    cy.get('#contacto').type('78945612');
    cy.get('#form-surtidor').submit();

    cy.contains('Surtidor Test')
      .parent()
      .within(() => {
        cy.contains('Editar').click();
      });

    cy.get('#editar-nombre').clear().type('Surtidor Editado');
    cy.get('#editar-estado').select('Disponible');
    cy.get('#editar-fila').clear().type('10');
    cy.get('#guardar-edicion').click();

    cy.contains('Surtidor Editado').should('exist');
    cy.contains('Disponible').should('exist');
    cy.contains('10').should('exist');
  });
});
