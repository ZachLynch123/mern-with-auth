const express = require('express');
const mongoose = require('mongoose');
const parser = require('body-parser');
const keys = require('./config/keys')

const app = express();
const PORT = process.env.PORT || 5000;

app.use(parser.json());

const db = keys.mongoURI;


mongoose
.connect(db, { useNewUrlParser: true })
.then(() => console.log('db connected'))
.catch(e => console.log(e));

app.listen(port => console.log(`server running on port: ${PORT}`))