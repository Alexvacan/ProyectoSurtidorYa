describe("Mostrar tickets", () => {
  before(() => {
    cy.visit("/");
    cy.clearLocalStorage();
    // Esperar a que la aplicación cargue completamente
    cy.get("body").should("exist");
  });

  it("Genera y muestra un ticket correctamente", () => {
    // 1. Crear surtidor de prueba
    cy.get("#nombre").type("Surtidor Test");
    cy.get("#direccion").type("Av. Test 123");
    cy.get("#estado").select("Disponible");
    cy.get("#fila").type("0");
    cy.get("#zona").select("Cercado");
    cy.get("#litros").type("10000");
    cy.get("#apertura").type("08:00");
    cy.get("#cierre").type("20:00");
    cy.get("#contacto").type("1234567");
    cy.get("#form-surtidor").submit();

    // Manejar el alert de confirmación de manera más flexible
    cy.on("window:alert", (text) => {
      if (text.includes("Surtidor agregado correctamente")) {
        // Cerrar el alert automáticamente
        return true;
      }
    });

    // Esperar a que el surtidor aparezca en la lista
    cy.contains("#lista-surtidores li", "Surtidor Test", { timeout: 10000 }).should("exist");

    // 2. Generar ticket
    cy.contains("#lista-surtidores li", "Surtidor Test").within(() => {
      cy.contains("button", "Generar Ticket").click();
    });

    // Esperar a que el modal esté visible
    cy.get("#modal-ticket").should("be.visible");

    // 3. Rellenar formulario de ticket
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    const fecha = tomorrow.toISOString().split('T')[0];
    
    cy.get("#ticket-fecha-programada").type(fecha);
    cy.get("#ticket-hora").select("10:00");
    cy.get("#ticket-monto").type("100");

    // 4. Confirmar ticket
    cy.get("#guardar-ticket").click();

    // Manejar el alert del ticket
    cy.on("window:alert", (text) => {
      if (text.includes("Ticket")) {
        expect(text).to.include("Surtidor Test");
        expect(text).to.include("10:00");
        expect(text).to.include("100");
        return true; // Cierra el alert
      }
    });

    // 5. Verificar que el contador se actualizó
    cy.contains("#lista-surtidores li", "Surtidor Test")
      .contains("Tickets generados: 1")
      .should("exist");
  });
});