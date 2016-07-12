'use strict';
// Libraries imports
const express = require('express');
const cors = require('cors')
const bodyParser = require('body-parser');

// services
const peopleServices = require('./services/people.js');
const mapServices = require('./services/map.js')

const API_PORT = process.env.PORT || 8080;

const app = express();

app.use(cors());
app.use(bodyParser.json());

// entries

app.get('/test', peopleServices.test);
app.get('/people/:name', peopleServices.getPeople);
app.get('/people', peopleServices.getAllPeople);

app.get('/maps/:name', mapServices.getMap);

//app.get('/maps/:number', mapServices.getMapByNumber);

console.log('Initializing the API...');

app.listen(API_PORT, () => {
    console.log(`API listening on port ${API_PORT}`);
});

