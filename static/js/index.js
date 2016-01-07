$(document).ready(function() {
  Dropzone.options.resumeDropzone = {
    paramName: "resume",
    maxFilesize: 8,
    parallelUploads: 1,
    dictDefaultMessage: "Drag your resume here or click to select a file. (8 MB Max!)",
    createImageThumbnails: false,
    acceptedFiles: ".doc,.ps,.pdf,application/pdf", // Yes you can upload arbitrary files
                                                    // No it's not worth the time policing you.
    complete: function(file) {
      window.location = file.xhr.responseURL;
    },
    sending: function() {
      $('.dz-message span').text("Uploading...");
    }
  };
});
