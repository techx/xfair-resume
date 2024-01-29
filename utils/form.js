var forms = require('forms');
var fields = forms.fields;
var validators = forms.validators;
var widgets = forms.widgets;

var gradYearChoices = ['- Select a graduation year', '2024', '2025', '2026', '2027', 'Graduate'];
var degreeChoices = ['- Select a degree type', 'Bachelors', 'Masters', 'Doctorate'];
var majorChoices = [
  "Course 1 - Civil and Environmental Engineering",
  "Course 2 - Mechanical Engineering",
  "Course 2OE - Ocean Engineering",
  "Course 3 - Materials Science and Engineering",
  "Course 4 - Architecture",
  "Course 4B - Art and Design",
  "Course 5 - Chemistry",
  "Course 5-7 - Chemistry and Biology",
  "Course 6-1 - Electrical Science and Engineering",
  "Course 6-2 - Electrical Engineering and Computer Science",
  "Course 6-3 - Computer Science and Engineering",
  "Course 6-4 - Artificial Intelligence and Decision Making",
  "Course 6-7 - Computer Science and Molecular Biology",
  "Course 6-9 - Computation and Cognition",
  "Course 6-14 - Computer Science, Economics, and Data Science",
  "Course 7 - Biology",
  "Course 8 - Physics",
  "Course 9 - Brain and Cognitive Sciences",
  "Course 10 - Chemical Engineering",
  "Course 10B - Chemical-Biological Engineering",
  "Course 11 - Planning",
  "Course 11-6 - Urban Science and Planning with Computer Science",
  "Course 12 - Earth, Atmospheric, and Planetary Sciences",
  "Course 14 - Economics",
  "Course 14-2 - Mathematical Economics",
  "Course 15-1 - Management",
  "Course 15-2 - Business Analytics",
  "Course 15-3 - Finance",
  "Course 16 - Aerospace Engineering",
  "Course 17 - Political Science",
  "Course 18 - Mathematics",
  "Course 18C - Mathematics with Computer Science",
  "Course 20 - Biological Engineering",
  "Course 21 - Humanities",
  "Course 21A - Anthropology",
  "Course 21E - Humanities and Engineering",
  "Course 21G - Global Studies and Languages",
  "Course 21H - History",
  "Course 21L - Literature",
  "Course 21M-1 - Music",
  "Course 21M-2 - Theater Arts",
  "Course 21S - Humanities and Science",
  "Course 21W - Writing",
  "Course 22 - Nuclear Science and Engineering",
  "Course 24-1 - Linguistics",
  "Course 24-2 - Linguistics and Philosophy",
  "Course CMS - Comparative Media Studies",
  "Course CSB - Computational and Systems Biology",
  "Course ESD - Engineering Systems",
  "Course HST - Health Sciences and Technology",
  "Course MAS - Media Arts and Sciences",
  "Course STS - Science, Technology, and Society"
];

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
