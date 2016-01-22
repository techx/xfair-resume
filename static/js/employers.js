$(document).ready(function() {

  var datatable = $("#search").DataTable({
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

  window.d = datatable;

  var createCSV = function(rows) {
    var result = ['email,name'];
    for (var i = 0; i < rows.length; i += 1) {
      var row = rows[i];
      var line = row['email'] + "," + row['name'];
      result.push(line);
    }
    var joined = result.join('\n');
    return new Blob([joined], {type: "text/csv"});
  }

  var downloadFile = function(blob, filename) {
    var a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = filename;
    a.click();
  }

  $("#export").on('click', function() {
    var rows = datatable.rows({filter:'applied'}).data();
    if (rows.length > 0) {
      var csv = createCSV(rows);
      downloadFile(csv, 'export.csv');
    }
  });
});
