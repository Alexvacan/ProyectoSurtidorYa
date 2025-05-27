describe("Mostrar tickets", () => {
  before(() => {
    cy.visit("https://surtidorya.netlify.app/");
    cy.clearLocalStorage();
    cy.get("body").should("exist");
  });

  it("Genera y muestra un ticket correctamente", () => {
    cy.contains("li", "Agregar surtidor").click();

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

    cy.on("window:alert", (text) => {
      if (text.includes("Surtidor agregado correctamente")) {
        return true;
      }
    });

    cy.contains("li", "Surtidores").click();

    cy.contains("#lista-surtidores li", "Surtidor Test", { timeout: 10000 }).should("exist");

    cy.contains("#lista-surtidores li", "Surtidor Test").within(() => {
      cy.contains("button", "Generar Ticket").click();
    });

    cy.get("#modal-ticket").should("be.visible");

    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    const fecha = tomorrow.toISOString().split('T')[0];

    cy.get("#ticket-fecha-programada").type(fecha);
    cy.get("#ticket-hora").select("10:00");
    cy.get("#ticket-monto").type("100");
    cy.get("#ticket-nombre-reservante").type("Juan");

    cy.get("#guardar-ticket").click();

    cy.on("window:alert", (text) => {
      if (text.includes("Ticket")) {
        expect(text).to.include("Surtidor Test");
        expect(text).to.include("10:00");
        expect(text).to.include("100");
        return true;
      }
    });

    cy.contains("#lista-surtidores li", "Surtidor Test").within(() => {
      cy.contains("Tickets generados: 1").should("exist");
    });
  });
});
