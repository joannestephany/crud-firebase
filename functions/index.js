const {onRequest} = require("firebase-functions/v2/https");
const logger = require("firebase-functions/logger");
const functions = require("firebase-functions");

const app = require('express')();

const admin = require('firebase-admin');
admin.initializeApp();

const db = admin.firestore().collection('todos');

// TODO: create todo
// TODO: get todo

app.get('/todos', (req, res) => {
    db.get()
        .then(function(docs){
            let todos = [];
            docs.forEach(function(doc){
                todos.push({
                    id: doc.id,
                    description: doc.data().description
                });
            })
            res.json(todos);
        })
    
});

app.post('/todos', (req, res) => {

    const newTodo = {
        description: req.body.description
    }
    db.add(newTodo)
        .then(function(doc){
            res.json({message: `document ${doc.id} created successfully`});
        })
        .catch(function(err){
            logger.error(err);
            res.status(500).json({error: 'something went wrong'});
        });
});

exports.api = functions.https.onRequest(app);

