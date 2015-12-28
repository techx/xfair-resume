$(document).ready(function() {
  $("#search").DataTable({
    ajax: {
      url: "/employers/records.json",
      dataSrc: ""
    },
    columns: [
      {
        data: "name",
        render: function(data, type, row, meta) {
          var a = $("<a>");
          a.text(data);
          a.attr('href', row['resume']);
          a.attr('target','_blank');
          return a[0].outerHTML;
        }
      },
      {
        data: "major[, ]"
      },
      {
        data: "year"
      },
      {
        data: "degree"
      },
      {
        data: "email",
        render: function(data, type, row, meta) {
          return '<a href="mailto:' + data + '">' + data + '</a>';
        }
      }
    ],
    pageLength: 25
  });
});
