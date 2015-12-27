var forms = require('forms');
var fields = forms.fields;
var validators = forms.validators;
var widgets = forms.widgets;

var gradYearChoices = ['', '2016', '2017', '2018', '2019', 'Graduate'];
var degreeChoices = ['', 'Bachelors', 'Masters', 'Doctorate'];
var majorChoices = ['Course 2', 'Course 6-1', 'Course 6-2', 'Course 6-3'];

var form = forms.create({
  name: fields.string({
    required: true,
    label: 'Full Name'
  }),
  email: fields.email({
    required: true,
    validators: [
      validators.email()
    ]
  }),
  year: fields.number({
    required: true,
    label: 'Class Year',
    widget: widgets.select(),
    choices: gradYearChoices,
    validators: [
      validators.min(1, "You must select a class year.")
    ]
  }),
  major: fields.array({
    required: true,
    widget: widgets.multipleSelect(),
    choices: majorChoices
  }),
  degree: fields.number({
    required: true,
    label: 'Degree Type',
    widget: widgets.select(),
    choices: degreeChoices,
    validators: [
      validators.min(1, "You must select a degree type.")
    ]
  }),
  mit_id: fields.string({
    required: true,
    label: 'MIT ID Number',
    widget: widgets.number(),
    validators: [
      validators.digits(),
      validators.minlength(9),
      validators.maxlength(9)
    ]
  })
}, {
  validatePastFirstError: true
});

form.majorChoices = majorChoices;
form.gradYearChoices = gradYearChoices;
form.degreeChoices = degreeChoices;

module.exports = form;
