var mongoose = require('mongoose');
var form = require('../utils/form');

var schema = new mongoose.Schema({
  uuid: String,
  resume: String,
  name: String,
  email: String,
  year: Number,
  major: [Number],
  degree: Number,
  mit_id: String,
  filled_out: {type: Boolean, default: false}
});

schema.virtual('form').get(function() {
  return form.bind(this);
});

schema.virtual('s3_url').get(function() {
  return process.env.AMAZON_S3_ENDPOINT + "/" + process.env.AMAZON_BUCKET + "/" + this.resume;
});

schema.virtual('year_name').get(function() {
  return form.gradYearChoices[this.year];
});

schema.virtual('major_name').get(function() {
  var result = [];
  for (var i = 0; i < this.major.length; i += 1) {
    result.push(form.majorChoices[this.major[i]]);
  }
  return result;
});

schema.virtual('degree_name').get(function() {
  return form.degreeChoices[this.degree];
});

schema.virtual('url').get(function() {
  return process.env.URL_BASE + '/' + this.uuid;
});

module.exports = mongoose.model('Record', schema);
