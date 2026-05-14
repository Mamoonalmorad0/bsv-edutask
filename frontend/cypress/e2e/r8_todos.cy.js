describe("R8 Todo items of a task", () => {
  let uid;
  let name;
  let email;

  before(function () {
    cy.fixture("user.json").then((user) => {
      const uniqueEmail = `${Date.now()}_${user.email}`;
      const createdUser = {
        firstName: user.firstName,
        lastName: user.lastName,
        email: uniqueEmail,
      };

      cy.request({
        method: "POST",
        url: "http://localhost:5000/users/create",
        form: true,
        body: createdUser,
      }).then((response) => {
        uid = response.body._id.$oid;
        name = `${createdUser.firstName} ${createdUser.lastName}`;
        email = createdUser.email;
      });
    });
  });

  beforeEach(function () {
    cy.visit("/");
    cy.contains("div", "Email Address").find("input[type=text]").type(email);
    cy.get("form").submit();
    cy.get("h1").should("contain.text", `Your tasks, ${name}`);
  });

  it("R8UC1 create a todo item", () => {
    const taskTitle = `Task ${Date.now()}`;
    const viewKey = "dQw4w9WgXcQ";
    const todoText = `Todo ${Date.now()}`;

    cy.get("input#title").type(taskTitle);
    cy.get("input#url").type(viewKey);
    cy.contains("input[type=submit]", "Create new Task").click();

    cy.contains(".title-overlay", taskTitle).click();
    cy.get("ul.todo-list").should("exist");

    cy.get("input[placeholder='Add a new todo item']").type(todoText);
    cy.contains("input[type=submit]", "Add").click();

    cy.contains("li.todo-item", todoText).should("exist");
  });

  it("R8UC2 toggle a todo item", () => {
    const taskTitle = `Task ${Date.now()}`;
    const viewKey = "dQw4w9WgXcQ";
    const todoText = `Todo ${Date.now()}`;

    cy.get("input#title").type(taskTitle);
    cy.get("input#url").type(viewKey);
    cy.contains("input[type=submit]", "Create new Task").click();

    cy.contains(".title-overlay", taskTitle).click();

    cy.get("input[placeholder='Add a new todo item']").type(todoText);
    cy.contains("input[type=submit]", "Add").click();
    cy.contains("li.todo-item", todoText).as("targetTodo");

    cy.get("@targetTodo").find("span.checker").should("have.class", "unchecked");
    cy.get("@targetTodo").find("span.checker").click();
    cy.get("@targetTodo").find("span.checker").should("have.class", "checked");
  });

  it("R8UC3 delete a todo item", () => {
    const taskTitle = `Task ${Date.now()}`;
    const viewKey = "dQw4w9WgXcQ";
    const todoText = `Todo ${Date.now()}`;

    cy.intercept("DELETE", "**/todos/byid/*").as("deleteTodo");

    cy.get("input#title").type(taskTitle);
    cy.get("input#url").type(viewKey);
    cy.contains("input[type=submit]", "Create new Task").click();

    cy.contains(".title-overlay", taskTitle).click();

    cy.get("input[placeholder='Add a new todo item']").type(todoText);
    cy.contains("input[type=submit]", "Add").click();
    cy.contains("li.todo-item", todoText).as("targetTodo");

    cy.get("@targetTodo").find("span.remover").click({ force: true });
    cy.wait("@deleteTodo").its("response.statusCode").should("eq", 200);
    cy.contains("li.todo-item", todoText).should("not.exist");
  });

  after(function () {
    if (!uid) return;
    cy.request({
      method: "DELETE",
      url: `http://localhost:5000/users/${uid}`,
    });
  });
});
