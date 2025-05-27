describe('Buscar surtidor por nombre', () => {
  beforeEach(() => {
    cy.visit('http://localhost:1234'); // o la URL real donde estás sirviendo tu app
  });

  it('Debería mostrar sólo los surtidores cuyo nombre coincida con la búsqueda', () => {
    // Navega a la sección "Surtidores"
    cy.contains('Surtidores').click();

    // Verifica que estamos en la sección correcta
    cy.get('section#listado').should('have.class', 'active');

    // Simula surtidores cargados si es necesario (esto depende de tu app)
    cy.window().then((win) => {
      const lista = win.document.getElementById('lista-surtidores');
      lista.innerHTML = `
        <li class="surtidor">Surtidor A - Cercado</li>
        <li class="surtidor">Surtidor B - Pacata</li>
        <li class="surtidor">Estación Central</li>
      `;
    });

    // Escribe en el campo de búsqueda
    cy.get('#busqueda-nombre').type('Surtidor A');

    // Espera un poco si tu filtro es con debounce
    cy.wait(500);

    // Verifica que solo Surtidor A esté visible
    cy.get('#lista-surtidores li').should('have.length', 1);
    cy.get('#lista-surtidores li').first().should('contain.text', 'Surtidor A');
  });
});
