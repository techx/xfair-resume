$(document).ready(function() {
  $('input').each(function() {
    var label_text = $(this).prev().text();
    $(this).attr('placeholder', label_text);
  });

  if (window.show_alert)
    swal("Success!", "Your changes were saved.", "success");
});
