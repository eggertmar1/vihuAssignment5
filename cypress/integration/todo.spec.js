//import findbytestid() from '@testing-library/cypress/built/commands'
describe("📝 TODO app", () => {
  // TODO Add your Cypress tests here
  // wisit on port 3000
  before(() => {
    cy.exec("npm run prisma:reset");
  });
  beforeEach(() => {
    cy.visit("http://localhost:3000/#");
  });
  // write a cypress test that validate the todo list is empty
  it("should have an empty todo list", () => {
    cy.get("[data-testid=todo-item]").should("have.length", 0);
  });
  // // write a cypress test that adds a todo item
  it("should add a todo item", () => {
    cy.get("[data-testid=todo-input]").type("Buy milk");
    cy.get("[data-testid=todo-input]").type("{enter}");
    cy.get("[data-testid=todo-item]").should("have.length", 1);
  });
  // // write a cypress test that adds a second item
  it("should add a second todo item", () => {
    cy.get("[data-testid=todo-input]").type("Buy bread");
    cy.get("[data-testid=todo-input]").type("{enter}");
    cy.get("[data-testid=todo-item]").should("have.length", 2);
  });

  // // write a cypress test that removes a todo item
  it("should remove a todo item", () => {
    cy.get("[data-testid=todo-item]").first().click();
    cy.get("[data-testid=todo-item]").should("have.length", 1);
  });
});
