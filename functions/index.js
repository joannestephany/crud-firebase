const { onRequest } = require("firebase-functions/v2/https");
const logger = require("firebase-functions/logger");
const functions = require("firebase-functions");
const cors = require("cors");
const admin = require('firebase-admin');
const express = require('express');


admin.initializeApp();
const db = admin.firestore().collection('todos');

const app = require('express')();
app.use(cors({ origin: true }));
app.use(express.json());

//get all
app.get('/todos', (req, res) => {
    db.get()
        .then(function (docs) {
            let todos = [];
            docs.forEach(function (doc) {
                todos.push({
                    id: doc.id,
                    description: doc.data().description,
                    done: doc.data().done
                });
            })
            res.json(todos);
        })

});

//create 
app.post('/todos', (req, res) => {

    const newTodo = {
        description: req.body.description,
        done: false
    }
    db.add(newTodo)
        .then(function (doc) {
            res.json({ message: `document ${doc.id} created successfully` });
        })
        .catch(function (err) {
            logger.error(err);
            res.status(500).json({ error: 'something went wrong' });
        });
});

exports.api = functions.https.onRequest(app);

//edit
app.put('/todos/:todoId', (req, res) => {
    db.doc(req.params.todoId).update({ done: req.body.done })
        .then(function () {
            res.json({ message: 'updated successfully' });
        })
        .catch(function (err) {
            logger.error(err);
            res.status(500).json({ error: 'something went wrong' });
        });
});

//delete
app.delete('/todos/:todoId', (req, res) => {
    db.doc(req.params.todoId).delete()
        .then(function () {
            res.json({ message: 'deleted successfully' });
        })
        .catch(function (err) {
            logger.error(err);
            res.status(500).json({ error: 'something went wrong' });
        });
});
