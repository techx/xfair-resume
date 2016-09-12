// Duplicate Resume Resolver 
// @author Anthony Liu
// @date 2016/09/12

// dependencies
require('dotenv').config();
var fs = require('fs');
var uuid = require('node-uuid');
var mongoose = require('mongoose');
var Record = require('../models/Record');
var users = require('./data/users.json');

// config
var NAME_DIVIDER = ' -';
var PROGRESS_FILE = '.resumes.progress';

// work functions
function formatUsersJson(json) {
  var nameDict = {};
  json.forEach(function(a) {
    var name = a.profile.firstName + ' ' + a.profile.lastName;
    nameDict[name] = nameDict[name] || [];
    nameDict[name].push(a);
  });
  return nameDict;
}

function moveDuplicates(usersInfo) {
  if (process.argv.length < 4) {
    return console.log('ERR: This script requires two directory arguments (where the resumes are and where to move them).');
  }

  var resumes = process.argv[2];
  var duplicates = process.argv[2];
  fs.readdir(resumes, function(err, files) {
    if (err) return console.log(err); 

    mongoose.connect(process.env.MONGO_ENDPOINT);

    // remove dupes due to multiple files
    var dupeDict = {};
    for (var i = 0; i < files.length; i++) {
      var fileName = files[i];
      var fullName = getFullName(usersInfo, fileName);
      if (fullName !== -1 && fullName !== -2) {
        dupeDict[fullName] = dupeDict[fileName] || [];
        dupeDict[fullName].push(fileName);
      } else {
        console.log('ERR: Bad file name: ' + fileName);
      }
    }

    for (var name in dupeDict) {
      if (
        dupeDict[name].length > 1 ||
        usersInfo[name].length > 1
      ) {
        console.log('moving resume and record for ' + name);
        for (var j = 0; j < dupeDict[name].length; j++) {
          fs.rename(resumes + '/' + fileName, duplicates + '/' + fileName);
        }
        // Record.remove({name: name});
      }
    }

    mongoose.connection.close();
  });
}

function getFullName(usersInfo, fileName) {
  // get their full name
  if (fileName.indexOf(NAME_DIVIDER) === -1) {
    return -1;
  }
  var name = fileName.split(NAME_DIVIDER)[0];
  if (!(name in usersInfo)) {
    return -2;
  }

  return name;
}

// work
moveDuplicates(formatUsersJson(users));
// for each file
//   append to a dict of names to file names
// for each dict entry with list.length > 1
//   delete the record_S_
//   move the resume files to a different directory
