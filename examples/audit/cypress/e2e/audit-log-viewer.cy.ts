describe("Test audit-log-viewer is working as expected", () => {
  it("View rendered audit-log-viewer", () => {
    cy.visit("/");
    // Should find mock single record as expected
    cy.contains("Pepe Silvia").should("exist");
  });
});
