$(document).ready(function() {
  Dropzone.options.resumeDropzone = {
    paramName: "resume",
    maxFilesize: 8,
    parallelUploads: 1,
    dictDefaultMessage: "Drag your resume here or click to select a file. (8 MB max, PDF only!) \nClick our logo to visit our main site and learn more about the fair",
    createImageThumbnails: false,
    acceptedFiles: ".pdf,application/pdf", // Yes you can upload arbitrary files
                                                    // No it's not worth the time policing you.
    complete: function(file) {
      if (file.xhr) {
        window.location = file.xhr.responseText;
      }
    },
    sending: function() {
      $('.dz-message span').text("Uploading...");
    },
    error: function(file, message) {
      if (message == "You can't upload files of this type.") {
        message = "You may only upload PDF files.";
      }
      swal('Uh oh.', message, 'error');
    }
  };
});
