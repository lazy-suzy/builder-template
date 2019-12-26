$(document).ready(function() {
  const template = Handlebars.compile($("#category").html());
  let products = [];
  const productTemplate = Handlebars.compile($("#products").html());
  const bottomPanelTemplate = Handlebars.compile($("#bottom-panel").html());
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
      products = data.products;
      $(".products")
        .children(".row")
        .html(productTemplate({ products: data.products }));
      $(".bottom-panel").html(bottomPanelTemplate(products[0]));
    });
  });

  $(".nav-link").click(function(event) {
    event.preventDefault();
    $(".nav-link").removeClass("active");
    $(this).addClass("active");
    $(".tab").removeClass("active");
    $($(this).attr("href")).addClass("active");
  });

  $("body").on("click", ".product-image", function() {
    const product = products[$(this).attr("data-product")];
    $(".bottom-panel").html(bottomPanelTemplate(product));
  });

  $(".toggle-icon").click(function() {
    $(".toggle-icon").toggleClass("open");
    $(".left-panel").toggleClass("open");
  });
});
