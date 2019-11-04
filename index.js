const express = require('express');
const mongoose = require('mongoose');

const auth_route = require('./routes/auth');
const post_route = require('./routes/post');
const app = express();

mongoose.connect('mongodb://localhost/test');
var db = mongoose.connection;

db.once('open',() => {
    console.log('connected');
});

app.use(express.json());

app.use('/api/user',auth_route);
app.use('/api/post',post_route);

app.listen(5000, () => {
    console.log('Listening on port 5000');
});