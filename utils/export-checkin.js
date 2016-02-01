// For use with the xfair-checkin repo

require('dotenv').load();

var mongoose = require('mongoose');

mongoose.connect(process.env.MONGO_ENDPOINT);

var Record = require('../models/Record');

Record.find({ filled_out: true }).exec(function(err, records) {
  if (err)
    throw err;

  var result = {};

  for (var i = 0; i < records.length; i += 1) {
    var record = records[i];

    if (record.mit_id.substr(0,1) != '9') {
      // All MIT IDs start with a 9.
      continue;
    }
    result[record.mit_id] = {
      name: record.name,
      email: record.email,
      graduation: record.year_name,
      major: record.major_name.join(', ')
    };
  }

  console.log(JSON.stringify(result));

  process.exit();
});
