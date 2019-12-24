$(document).ready(function() {
  const template = Handlebars.compile($("#category").html());
  const productTemplate = Handlebars.compile($("#products").html());
  $.ajax({
    url:
      "http://staging.lazysuzy.com/api/products/all?filters=brand:pier1;&sort_type=&pageno=0",
    context: document.body
  }).done(function(data) {
    $(".components")
      .children(".row")
      .append(template({ categories: data.filterData.category }));
  });

  $("body").on("click", ".category-label", function() {
    const category = $(this).attr("data-category");
    $.ajax({
      url: `http://staging.lazysuzy.com/api/products/all?filters=brand:pier1;category:${category}&sort_type=&pageno=0`,
      context: document.body
    }).done(function(data) {
      $(".products")
        .children(".row")
        .html(productTemplate({ products: data.products }));
    });
  });

  $(".nav-link").click(function(event) {
    event.preventDefault();
    $(".nav-link").removeClass("active");
    $(this).addClass("active");
    $(".tab").removeClass("active");
    $($(this).attr("href")).addClass("active");
  });
});
