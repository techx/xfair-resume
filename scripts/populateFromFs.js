// Resume Uploader
// @author Anthony Liu
// @date 2016/09/12

// dependencies
require('dotenv').config();
var request = require('request');
var fs = require('fs');
var uuid = require('node-uuid');
var mongoose = require('mongoose');
var Record = require('../models/Record');
var users = require('./data/users.json');
var AWS = require('aws-sdk');
AWS.config.update({
  accessKeyId: process.env.AMAZON_ACCESS_KEY,
  secretAccessKey: process.env.AMAZON_SECRET_KEY,
  region: process.env.AMAZON_REGION
});
var s3 = new AWS.S3({
	params: {Bucket: process.env.AMAZON_BUCKET}
});

// config
var NAME_DIVIDER = ' -';
 
// work functions
function formatUsersJson(json) {
  var nameDict = {};
  json.forEach(function(a) {
    var name = a.profile.firstName + ' ' + a.profile.lastName;
    nameDict[name] = a;
  });
  return nameDict;
}

function handleResumes(usersInfo) {
  if (process.argv.length < 3) {
    return console.log('ERR: This script requires a directory argument (where the resumes are).');
  }

  var dir = process.argv[2];
  fs.readdir(dir, function(err, files) {
    if (err) return console.log(err); 

		var count = {n: files.length};
    files.forEach(function(fileName) {
      handleResume(usersInfo, fileName, function(err) {
				count.n -= 1;

				if (err) console.log(err);
				console.log(count.n + ' Processed "' + fileName + '".');

				if (count.n === 0) {
					mongoose.connection.close();
					console.log('All done.');
				}
			});
    });
  });
}

function handleResume(usersInfo, fileName, callback) {
  // get their full name
  if (fileName.indexOf(NAME_DIVIDER) === -1) {
    return callback({
      message: 'ERR: Resumes must begin with the user\'s full name. "' +
      fileName + '" does not.'
    });
  }
  var name = fileName.split(NAME_DIVIDER)[0];
  if (!(name in usersInfo)) {
    return callback({
			message: 'ERR: Name "' + name + '" is not in the users json.'
		});
  }

  // generate uuid
  var resumeId = uuid.v4();

  // try to upload to s3
  var fileNameS3 = resumeId;
  uploadToS3(fileName, fileNameS3, function(err) {
		if (err) return callback(err);

    // add a record with their resume's uuid and their app info
    var app = usersInfo[name];
    addRecord(resumeId, app, callback);
  });
}

function uploadToS3(fileName, fileNameS3, callback) {
  var dir = process.argv[2];
  var file = fs.createReadStream(
    dir + '/' + fileName
  );
  s3.upload({
    Body: file,
    Key: fileNameS3,
		ContentType: 'application/pdf'
  }, function(err, res) {
    if (err) return callback(err);

    callback(undefined, res);
  });
}

function addRecord(resumeId, app, callback) {
  var FULL_NAME = app.profile.firstName + ' ' +
    app.profile.lastName; 
  var YEAR = 3; // see utils/form.js
  var MAJOR = 8; // see utils/form.js
  var DEGREE = 1; // bachelors; see utils/form.js
  Record.create({
    uuid: uuid.v4(),
    resume: resumeId,
    name: FULL_NAME,
    email: app.email,
    year: YEAR,
    major: [MAJOR],
    degree: DEGREE,
    filled_out: true
  }, function(err, res) {
		if (err) return callback(err);

		callback(undefined, res);
	});
}

// work
if (!!users) {
	mongoose.connect(process.env.MONGO_ENDPOINT);
  handleResumes(
    formatUsersJson(users)
  );
} else {
  // Load users if not loaded already.
  var url = process.env.REG_URL;
  var token = process.env.JWT_TOKEN;
  request({
    uri: url + '/api/users',
    headers: {
      'x-access-token': token
    }
  }, function(err, res, body) {
    if (err) return console.log(err);
  
    console.log(body);
  });
}
