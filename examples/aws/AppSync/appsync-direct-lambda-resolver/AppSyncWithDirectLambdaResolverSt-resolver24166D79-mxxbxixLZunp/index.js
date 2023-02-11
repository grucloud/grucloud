// lib/main.resolver.ts
var AWS = require("aws-sdk");
var {
  util: {
    uuid: { v4: uuid }
  }
} = AWS;
var createdAt = new Date();
var todos = [
  { id: uuid(), name: "first todo", createdAt, updatedAt: createdAt },
  { id: uuid(), name: "second todo", createdAt, updatedAt: createdAt },
  { id: uuid(), name: "third todo", createdAt, updatedAt: createdAt },
  { id: uuid(), name: "fourth todo", createdAt, updatedAt: createdAt },
  { id: uuid(), name: "fifth todo", createdAt, updatedAt: createdAt }
];
var getTodo = ({ id }) => todos.find((todo) => todo.id === id);
var listTodos = ({ limit }) => ({ items: todos.slice(0, limit) });
var createTodo = ({ id, name, description }) => {
  const createdAt2 = new Date();
  const todo = { id: id != null ? id : uuid(), name, description, createdAt: createdAt2, updatedAt: createdAt2 };
  todos.push(todo);
  return todo;
};
var updateTodo = ({ id, name, description }) => {
  const index = todos.findIndex((todo2) => todo2.id === id);
  if (index < 0)
    return void 0;
  const todo = todos[index];
  if (name)
    todo.name = name;
  if (description)
    todo.description = description;
  todo.updatedAt = new Date();
  todos[index] = todo;
  return todo;
};
var deleteTodo = ({ id }) => {
  const index = todos.findIndex((todo) => todo.id === id);
  if (index < 0)
    return void 0;
  return todos.splice(index, 1)[0];
};
var operations = {
  Query: { getTodo, listTodos },
  Mutation: { createTodo, updateTodo, deleteTodo }
};
exports.handler = async (event) => {
  console.log(`incoming event >`, JSON.stringify(event, null, 2));
  console.log(`todos >`, JSON.stringify(todos, null, 2));
  const {
    arguments: args,
    info: { parentTypeName: typeName, fieldName }
  } = event;
  const type = operations[typeName];
  if (type) {
    const operation = type[fieldName];
    if (operation) {
      return operation(args);
    }
  }
  throw new Error("unknow operation");
};
