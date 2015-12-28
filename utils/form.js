var forms = require('forms');
var fields = forms.fields;
var validators = forms.validators;
var widgets = forms.widgets;

var gradYearChoices = ['- Select a graduation year', '2016', '2017', '2018', '2019', 'Graduate'];
var degreeChoices = ['- Select a degree type', 'Bachelors', 'Masters', 'Doctorate'];
var majorChoices = ['Course 2', 'Course 6-1', 'Course 6-2', 'Course 6-3'];

var form = forms.create({
  name: fields.string({
    required: true,
    widget: widgets.text({ classes: ['form-control'] }),
    label: 'Full Name',
    errorAfterField: true,
    cssClasses: { field: [ 'form-group' ] }
  }),
  email: fields.email({
    required: true,
    widget: widgets.text({ classes: ['form-control'] }),
    validators: [
      validators.email()
    ],
    errorAfterField: true,
    cssClasses: { field: [ 'form-group' ] }
  }),
  year: fields.number({
    required: true,
    label: 'Class Year',
    widget: widgets.select({ classes: ['form-control'] }),
    choices: gradYearChoices,
    validators: [
      validators.min(1, "You must select a class year.")
    ],
    errorAfterField: true,
    cssClasses: { field: [ 'form-group' ] }
  }),
  major: fields.array({
    required: true,
    widget: widgets.multipleSelect({ classes: ['form-control'] }),
    choices: majorChoices,
    errorAfterField: true,
    cssClasses: { field: [ 'form-group' ] }
  }),
  degree: fields.number({
    required: true,
    label: 'Degree Type',
    widget: widgets.select({ classes: ['form-control'] }),
    choices: degreeChoices,
    validators: [
      validators.min(1, "You must select a degree type.")
    ],
    errorAfterField: true,
    cssClasses: { field: [ 'form-group' ] }
  }),
  mit_id: fields.string({
    required: true,
    label: 'MIT ID Number',
    widget: widgets.number({ classes: ['form-control'] }),
    validators: [
      validators.digits(),
      validators.minlength(9),
      validators.maxlength(9)
    ],
    errorAfterField: true,
    cssClasses: { field: [ 'form-group' ] }
  })
}, {
  validatePastFirstError: true
});

form.majorChoices = majorChoices;
form.gradYearChoices = gradYearChoices;
form.degreeChoices = degreeChoices;

module.exports = form;
