describe('Editar surtidor', () => {
  beforeEach(() => {
    cy.visit('http://localhost:1234');
  });

  it('Debería editar un surtidor existente', () => {
    cy.contains('li', 'Agregar surtidor').click();

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

    cy.contains('li', 'Surtidores').click();

    cy.contains('#lista-surtidores li', 'Surtidor Test')
      .within(() => {
        cy.contains('Editar').click();
      });

    cy.get('#modal-edicion').should('not.have.class', 'oculto');

    cy.get('#editar-nombre').clear().type('Surtidor Editado');
    cy.get('#editar-estado').select('Disponible');
    cy.get('#editar-fila').clear().type('10');
    cy.get('#guardar-edicion').click();

    cy.contains('#lista-surtidores', 'Surtidor Editado').should('exist');
    cy.contains('#lista-surtidores', 'Disponible').should('exist');
    cy.contains('#lista-surtidores', '10').should('exist');
  });
});
