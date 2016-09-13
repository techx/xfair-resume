// Duplicate Resume Resolver 
// @author Anthony Liu
// @date 2016/09/12

// dependencies
require('dotenv').config();
var fs = require('fs');
var mongoose = require('mongoose');
var Record = require('../models/Record');
var users = require('./data/users.json');

// config
var NAME_DIVIDER = ' -';

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
  var duplicates = process.argv[3];
  fs.readdir(resumes, function(err, files) {
    if (err) return console.log(err); 

    mongoose.connect(process.env.MONGO_ENDPOINT);

    // remove dupes due to multiple files
    var dupeDict = {};
    for (var i = 0; i < files.length; i++) {
      var fileName = files[i];
      var fullName = getFullName(usersInfo, fileName);
      if (fullName !== -1 && fullName !== -2) {
        if (!(fullName in dupeDict)) {
          dupeDict[fullName] = [];
        }
        dupeDict[fullName].push(fileName);
      } else {
        console.log('ERR: Bad file name: ' + fileName);
      }
    }

    var numRemaining = 0;
    for (var name in dupeDict) {
      if (
        usersInfo[name].length > 1
      ) {
        console.log('moving resume and record for ' + name);
        for (var j = 0; j < dupeDict[name].length; j++) {
          var dupeName = dupeDict[name][j];
          var from = resumes + '/' + dupeName;
          var to = duplicates + '/' + dupeName;
          fs.rename(from, to);
        }
        Record.remove(
          {name: name},
          (function(nameToRemove) {
            return function(err, res) {
              if (err) return console.log(err);

              console.log('REMOVED ' + nameToRemove);
            };
          })(name)
        );
      } else if (dupeDict[name].length > 1) {
        Record.find({
          name: name
        }, function(err, records) {
          for (var k = 0; k < records.length - 1; k++) {
            numRemaining += 1; 

            Record.remove({
              'uuid': records[k].uuid
            }, function(err, res) {
              if (err) return console.log(err)

              numRemaining -= 1;

              console.log('Removed record: ' + records[k].name); 
              if (numRemaining === 0) {
                mongoose.connection.close();
              }
            });
          }
        });
      }
    }
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
