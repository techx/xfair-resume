var uuid = require('node-uuid');
var Record = require('../models/Record');
var form = require('../utils/form');

module.exports = {
  index: function (req, res) {
    res.render('index');
  },

  create: function (req, res) {
    Record.create({
      id: uuid.v4(),
      resume: req.file.key
    }, function (err, new_record) {
      if (err)
        throw err;
      res.redirect('/'+new_record.id);
    });
  },

  view: function (req, res) {
    var record = req.record;
    res.render('record', {
      record: record,
      form: record.form
    });
  },

  update: function (req, res) {
    var record = req.record;
    form.handle(req, {
      success: function (form) {
        record.name = form.data.name;
        record.email = form.data.email;
        record.year = form.data.year;
        record.major = form.data.major;
        record.degree = form.data.degree;
        record.mit_id = form.data.mit_id;
        var first_time = !record.filled_out;
        record.filled_out = true;
        record.save(function(err) {
          if (err)
            throw err;
          if (first_time)
            var blah = 1; // Send email
          res.render('record', {
            record: record,
            form: record.form
          });
        });
      },
      error: function (form) {
        res.render('record', {
          record: record,
          form: form
        });
      }
    });
  },

  findRecord: function (req, res, next) {
    var token = req.params.token;
    Record.findOne({ id: token }, function (err, record) {
      if (err)
        throw err;
      if (record === null) {
        res.status(404).send('Not found');
        return;
      }
      req.record = record;
      next();
    });
  }
};
