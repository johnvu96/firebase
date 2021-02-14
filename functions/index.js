//index.js

const functions = require('firebase-functions');
const express = require('express');
const cors = require('cors');

const app = express();

// Automatically allow cross-origin requests
app.use(cors({ origin: true }));


const { getAllTodos, postOneTodo, deleteTodo, editTodo } = require('./APIs/todos');
const { loginUser, signUpUser, uploadProfilePhoto, getUserDetail, updateUserDetails } = require('./APIs/users');
const auth = require('./util/auth');

app.get('/todos', auth, getAllTodos);
app.post('/todo', auth, postOneTodo);
app.delete('/todo/:todoId', auth, deleteTodo);
app.put('/todo/:todoId', auth, editTodo);

app.post('/login', loginUser);
app.post('/signup', signUpUser);
app.get('/user', auth, getUserDetail);
app.post('/user', auth, updateUserDetails);

app.post('/user/image', auth, uploadProfilePhoto);

exports.api = functions.https.onRequest(app);