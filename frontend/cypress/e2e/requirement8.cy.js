describe("Requirement 8 - Todo list manipulation", () => {
  beforeEach(() => {
    const email = `test${Date.now()}@test.com`;

    cy.visit("/");

    // Go to signup page
    cy.contains("Have no account yet? Click here to sign up.").click();

    // Fill signup form
    cy.get('input[type="text"]').eq(0).clear().type(email);
    cy.get('input[type="text"]').eq(1).clear().type("Test");
    cy.get('input[type="text"]').eq(2).clear().type("User");

    cy.contains("Sign Up").click();

    // Create a task so that Requirement 8 preconditions are fulfilled
    cy.contains("Your tasks").should("be.visible");

    cy.get('input[placeholder="Title of your Task"]').type("Work");
    cy.get('input[placeholder^="Viewkey"]').type("dQw4w9WgXcQ");
    cy.contains("Create new Task").click();

    // Open task detail view
    cy.get("img").first().click();

    // Check that the default todo item is visible
    cy.contains("Watch video").should("be.visible");
  });

  it("TC-R8UC1-1: creates a new todo item with a non-empty description", () => {
    cy.intercept("POST", "**/todos/create").as("createTodo");

    cy.get('input[placeholder="Add a new todo item"]')
      .type("Read lecture slides");

    cy.get('input[value="Add"]').click();

    cy.wait("@createTodo");

    cy.contains(".todo-item", "Read lecture slides")
      .should("be.visible");
  });

  it("TC-R8UC1-2: Add button should be disabled when the description is empty", () => {
    cy.get('input[placeholder="Add a new todo item"]')
      .should("have.value", "");

    cy.get('input[value="Add"]')
      .should("be.disabled");
  });

  it("TC-R8UC2-1 and TC-R8UC2-2: toggles a todo item between active and done", () => {
    cy.contains("Watch video")
      .parents("li")
      .find(".checker")
      .click();

    cy.contains("Watch video")
      .parents("li")
      .find(".checker")
      .should("have.class", "checked");

    cy.contains("Watch video")
      .parents("li")
      .find(".checker")
      .click();

    cy.contains("Watch video")
      .parents("li")
      .find(".checker")
      .should("have.class", "unchecked");
  });

  it("TC-R8UC3-1: deletes an existing todo item", () => {
    cy.intercept("DELETE", "**/todos/byid/*").as("deleteTodo");

    cy.contains(".todo-item", "Watch video")
      .find(".remover")
      .should("be.visible")
      .click();

    cy.wait("@deleteTodo");

    cy.get(".todo-list").should("not.contain", "Watch video");
  });
});
