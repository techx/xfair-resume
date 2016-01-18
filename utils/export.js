require('dotenv').load();

var mongoose = require('mongoose');

mongoose.connect(process.env.MONGO_ENDPOINT);

var Record = require('../models/Record');

function recordToFilename(record) {
  var unsanitizedName = record.year_name + '_' + record.name + '_' + record.uuid.substr(3) + '.' + record.resume.split('.').pop();
  return unsanitizedName.replace(/[^a-zA-Z0-9]/g,'_');
}

Record.find({ filled_out: true }).exec(function(err, records) {
  if (err)
    throw err;

  for (var i = 0; i < records.length; i += 1) {
    var record = records[i];
    console.log([record.major_name[0], record.s3_url, recordToFilename(record)].join(','));
  }

  process.exit();
});
