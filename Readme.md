xfair-resume
============

A simple webapp used to collect resumes from xFair attendees, as well as provide a searchable list to employers.

Setup
-----

Make sure you have `brew`, `npm`, `node`, and `mongodb` installed.

- [Go here for brew](http://brew.sh/)
- Use `brew install node` to install `node` and `npm`
- Use `brew install mongodb` to install Mongodb.

Running locally
---------------

If it's your first time running the server, run `npm run init`.

Then, when you want to start the server, run `npm run start-services`

To start the actual server, run `npm start`

After you're done running the server, run `npm run stop-services`

General Design
--------------

The homepage is a simple place where students can drop their resume. Upon dropping, it uploads their resume to the server, which then uploads it to Amazon S3(*).

Then, it generates a unique link through which students can edit their info. We collect the following pieces of information.

1. Name
2. Email
3. Class year
4. Major(s)
5. Degree type (Bachelors, Masters, PhD)
6. MIT ID Number

Only #6 is not viewable/searchable by employers. Employers can login to the server by visiting `/employers`, using the username and password specified in the environemnt variables(+).

Notes
-----

(*) In development mode, things are uploaded to a mock s3 server called s3rver, which runs on your own computer.

(+) See the `.env.base` file for a list of loaded environment variables.

Upon running `npm run init`, it copies the base environment variable file to `.env`, which gets loaded by the runtime. **DO NOT MAKE CHANGES TO THE `.env.base` FILE FOR LOCAL CONFIGURATIONS.** Instead, make your changes in the `.env` file, which actually gets loaded by the application, and doesn't get commited.
