require('dotenv').load();
var mongoose = require('mongoose');
var Record = require("../models/Record");
var uuid = require('node-uuid');
var form = require("./form");
mongoose.connect(process.env.MONGO_ENDPOINT);

var NUM_USERS = 5000;
var created = 0;

function processUser(err, user) {
  if (err)
    throw err;
  created += 1;
  if (created % 1000 === 0)
    console.log("Creating user " + created + ".");
  if (created == NUM_USERS) {
    process.exit();
  }
}

console.log("Creating " + NUM_USERS + " users...");
for (var i = 0; i < NUM_USERS; i++) {
  Record.create({
    uuid: uuid.v4(),
    resume: "resumes/" + uuid.v4() + ".pdf",
    name: "Person " + i,
    email: "person" + i + "@mit.edu",
    year: Math.floor(Math.random()*5) + 1,
    major: [Math.floor(Math.random()*4)],
    degree: Math.floor(Math.random()*3) + 1,
    mit_id: Math.floor(Math.random()*900000000 + 100000000) + "",
    filled_out: true
  }, processUser);
}
