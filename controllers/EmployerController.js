var Record = require('../models/Record');

module.exports = {
  search: function(req, res) {
    res.render('employers');
  },
  records: function(req, res) {
    Record.find({ filled_out: true }, function (err, records) {
      result = [];
      for (var i = 0; i < records.length; i += 1) {
        result.push({
          name: records[i].name,
          resume: records[i].s3_url,
          email: records[i].email,
          major: records[i].major_name,
          year: records[i].year_name,
          degree: records[i].degree_name
        });
      }
      if (err)
        throw err;
      res.json(result);
    });
  }
};
