require('dotenv').load();

if (process.env.AMAZON_S3_ENDPOINT == 'amazon') {
  process.env.AMAZON_S3_ENDPOINT = 'https://s3.amazonaws.com';
}

var express = require('express');
var mongoose = require('mongoose');
var upload = require('./utils/upload');

mongoose.connect(process.env.MONGO_ENDPOINT);

var basicAuth = require('basicauth-middleware');

var auth = basicAuth(process.env.EMPLOYER_USERNAME, process.env.EMPLOYER_PASSWORD);

var app = express();

app.use('/static', express.static('static'));
app.use('/static', express.static('bower_components'));
app.set('views', './views');
app.set('view engine', 'jade');

var dropController = require('./Controllers/DropController');
var employerController = require('./Controllers/EmployerController');

app.get('/employers', auth, employerController.search);
app.get('/employers/records.json', auth, employerController.records);
app.get('/', dropController.index);
app.post('/upload', upload.single('resume'), dropController.create);
app.get('/:token', dropController.findRecord, dropController.view);
app.post('/:token', dropController.findRecord, dropController.update);

app.listen(process.env.PORT);
console.log("App listening on port " + process.env.PORT);
