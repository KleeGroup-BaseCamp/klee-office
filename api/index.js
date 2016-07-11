'use strict';
// Libraries imports
const express = require('express');
const cors = require('cors')
const bodyParser = require('body-parser');

// services
const personServices = require('./services/person.js');

const API_PORT = process.env.PORT || 8080;

const app = express();

app.use(cors());
app.use(bodyParser.json());

// entries

app.get('/test', personServices.test);
app.get('/people/:name', personServices.getPeople);
app.get('/people', personServices.getAllPeople);

//app.get('/maps/:number', mapServices.getMapByNumber);

console.log('Initializing the API...');

app.listen(API_PORT, () => {
    console.log(`API listening on port ${API_PORT}`);
});

