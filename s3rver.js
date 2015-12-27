var S3rver = require('s3rver');
var client = new S3rver({
  port: 4569,
  hostname: 'localhost',
  silent: false,
  directory: './s3rver/'
});
client.run(function(err, host, port) {
  console.log("Running s3rver on http://" + host + ":" + port);
});
