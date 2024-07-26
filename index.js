const functions = require('firebase-functions');
const admin = require("firebase-admin");
const app = require("express")();

admin.initializeApp();
const db = admin.firestore().collection("todos");

// TODO: create todoList
// TODO: remove todoList

// mostra todas as tarefas
app.get("/todos", function (request, response) {
  db.get()
    .then(function (docs) {
      let todos = [];
      docs.forEach(function (doc) {
        todos.push({
          id: doc.id,
          description: doc.data().description
        })
      })
      response.json(todos);
    });
})

// adiciona uma nova tarefa
app.post("/todos", function (request, response) {
  db.add({ description: request.body.description })
    .then(function () {
      response.json({ general: "Works" });
    })
})

// deleta uma tarefa
app.delete("/todos/:todoId", function (request, response) {
  db.doc(request.params.todoId).delete()
    .then(function () {
      response.json({ general: "Deleted" });
    })
})

// edita uma tarefa
app.put("/todos/:todoId", function (request, response) {
  db.doc(request.params.todoId).update({ description: request.body.description })
    .then(function () {
      response.json({ general: "Updated" });
    })
})

exports.api = functions.https.onRequest(app)