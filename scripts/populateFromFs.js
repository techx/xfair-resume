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
var PROGRESS_FILE = '.resumes.progress';
 
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

    var progressDict = {};
    fs.closeSync(fs.openSync(PROGRESS_FILE, 'a'));
    var lineReader = require('readline').createInterface({
      input: fs.createReadStream(PROGRESS_FILE)
    });
    lineReader.on('line', function(line) {
      progressDict[line] = true;
    });
    lineReader.on('close', function() {
      handleResumesAsync(usersInfo, progressDict, files, 0);
    });
  });
}

function handleResumesAsync(usersInfo, progressDict, files, i) {
  if (i >= files.length) {
    return finish();
  }

  var fileName = files[i];
  if (progressDict[fileName] === true) {
    console.log(i + ' Skipped ' + fileName);
    return handleResumesAsync(usersInfo, progressDict, files, i+1);
  }

  handleResume(usersInfo, fileName, function(err) {
    // log to the console
    if (err) {
      console.log(err);
    } else {
      console.log(
        i + ' Processed "' + fileName + '".'
      );
    }

    // record the completion of this resume for the future
    fs.appendFile(PROGRESS_FILE, fileName + '\n');

    handleResumesAsync(usersInfo, progressDict, files, i+1);
  });
}

function finish() {
  mongoose.connection.close();
  console.log('All done.');
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
  return callback(undefined, true);

  var dir = process.argv[2];
  var file = fs.createReadStream(
    dir + '/' + fileName
  );
  s3.upload({
    ACL: 'public-read',
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
  var YEAR = ({
    '2017': 1, '2018': 2, '2019': 3, '2020': 4
  })[app.profile.graduationYear] || 4; // see utils/form.js
  var DEGREE = 1; // bachelors; see utils/form.js

  Record.create({
    uuid: uuid.v4(),
    resume: resumeId,
    name: FULL_NAME,
    email: app.email,
    year: YEAR,
    major: [app.profile.major],
    degree: DEGREE,
    filled_out: true
  }, function(err, res) {
    if (err) return callback(err);

    callback(undefined, res);
  });
}

// work
var alreadyHaveUsers = true;
if (alreadyHaveUsers) {
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
