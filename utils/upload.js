var multer = require('multer');
var s3 = require('multer-s3');
var uuid = require('node-uuid');
var AWS = require('aws-sdk');

module.exports = multer({
  storage: s3({
    dirname: 'resumes',
    bucket: process.env.AMAZON_BUCKET,
    secretAccessKey: process.env.AMAZON_SECRET_KEY,
    accessKeyId: process.env.AMAZON_ACCESS_KEY,
    region: process.env.AMAZON_REGION,
    filename: function (req, file, cb) {
      var filename = uuid.v4() + ".pdf";
      cb(null, filename);
    },
    endpoint: new AWS.Endpoint(process.env.AMAZON_S3_ENDPOINT),
    acl: 'public-read',
    contentType: s3.AUTO_CONTENT_TYPE,
    s3ForcePathStyle: true
  }),
  limits: {
    fileSize: 10485760, // 10 MB
  }
});
