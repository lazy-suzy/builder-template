$(document).ready(function() {
  console.log("text");
  const template = Handlebars.compile($("#category").html());
  console.log();
  $.ajax({
    url:
      "http://staging.lazysuzy.com/api/products/all?filters=brand:pier1;&sort_type=&pageno=0",
    context: document.body
  }).done(function(data) {
    console.log(data);
    $(".components")
      .children(".row")
      .append(template({ categories: data.filterData.category }));
  });
});
