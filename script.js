$(document).ready(function() {
  Handlebars.registerHelper('ifEq', function(v1, v2, options) {
    if (v1 === v2) {
      return options.fn(this);
    }
    return options.inverse(this);
  });

  const template = Handlebars.compile($('#category').html());
  let products = [];
  const productTemplate = Handlebars.compile($('#products').html());
  const bottomPanelTemplate = Handlebars.compile($('#bottom-panel').html());
  const filterTemplate = Handlebars.compile($('#filter-template').html());
  $.ajax({
    url:
      'http://staging.lazysuzy.com/api/products/all?filters=brand:pier1;&sort_type=&pageno=0',
    context: document.body
  }).done(function(data) {
    $('.components')
      .children('.row')
      .append(template({ categories: data.filterData.category }));
    $('.filter-section').html(
      filterTemplate({
        filterData: data.filterData,
        filterKeys: Object.keys(data.filterData)
      })
    );
  });

  $('body').on('click', '.category-label', function() {
    $('.custom-products').removeClass('show');
    const category = $(this).attr('data-category');
    $(".nav-link[href='#browse']").click();
    $.ajax({
      url: `http://staging.lazysuzy.com/api/products/all?filters=brand:pier1;category:${category}&sort_type=&pageno=0`,
      context: document.body
    }).done(function(data) {
      products = data.products;
      $('.products')
        .children('.row')
        .html(productTemplate({ products: data.products }));
      $('.bottom-panel').html(bottomPanelTemplate(products[0]));
    });
  });

  $('.nav-link').click(function(event) {
    event.preventDefault();
    $('.nav-link').removeClass('active');
    $(this).addClass('active');
    $('.tab').removeClass('active');
    const target = $(this).attr('href');
    $(target).addClass('active');
    $('.left-panel').addClass(target.split('#')[1]);
    if (target !== '#browse') {
      $('.custom-products').removeClass('show');
    }
  });

  $('body').on('click', '.product-image', function() {
    const product = products[$(this).attr('data-product')];
    $('.bottom-panel').html(bottomPanelTemplate(product));
  });

  $('.toggle-icon').click(function() {
    $('.toggle-icon').toggleClass('open');
    $('.left-panel').toggleClass('open');
  });

  $('.filter-icon, .js-filter-close').click(function() {
    $('.mobile-filter').toggleClass('open');
  });

  $('body').on('click', '.tabs .nav-link', function(e) {
    e.preventDefault();
    $('.tab-pane').removeClass('active');
    $('.tabs .nav-link').removeClass('active');

    $(this).addClass('active');
    $($(this).attr('href')).addClass('active');
  });
  function toggleAddProduct(e) {
    e.preventDefault();
    $('.backdrop').toggleClass('show');
    $('.add-product-modal').toggleClass('show');
    $('.step').removeClass('active');
    $('#step1').addClass('active');
  }
  $('.js-addProduct, .close-modal').click(toggleAddProduct);

  $('.js-confirmation-modal, .js-close-confirmation-modal').click(function(e) {
    e.preventDefault();
    $('.backdrop').toggleClass('show');
    $('.confirmation-modal').toggleClass('show');
  });

  $('.step .js-btn').click(function(e) {
    e.preventDefault();
    $('.step').removeClass('active');
    const target = $(this).attr('target');
    target ? $(target).addClass('active') : toggleAddProduct(e);
  });

  $('.toggle-catalog').click(function() {
    $('.catalog-panel').toggleClass('open');
  });

  $('.js-open-custom').click(function() {
    $('.custom-products').addClass('show');
    $(".nav-link[href='#browse']").click();
  });

  $('.js-btn-go').hide();

  $('.canvas-style').click(function() {
    $('.canvas-style').removeClass('selected');
    $(this).addClass('selected');
    $('.js-btn-go').show();
    $('.canvas-options').addClass('d-none');
    $($(this).attr('target')).removeClass('d-none');
  });

  $('.js-open-config, .js-close-config-modal').click(function(e) {
    e.preventDefault();
    $('.backdrop').toggleClass('show');
    $('.canvas-config').toggleClass('show');
  });
});
