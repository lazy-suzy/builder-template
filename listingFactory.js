var remoteProducts = [];
class ListingFactory {
  constructor(
    base_url,
    filterConfig,
    elements = {},
    listingTemplate,
    filterTemplate
  ) {
    this.base_url = base_url;
    this.strFilters = '';
    this.iPageNo = 0;
    this.iLimit = 24;
    this.sortType = '';
    this.filterToIgnore = filterConfig.filterToIgnore;
    this.listingTemplate = listingTemplate || undefined;
    this.filterTemplate = filterTemplate || undefined;
    this.bFetchingProducts = false;
    this.bNoMoreProductsToShow = false;
    this.price_from = 0;
    this.price_to = 0;
    this.$productContainer =
      elements.$productContainer || $('#productsContainerDiv');
    this.$totalResults = elements.$totalResults || $('#totalResults');
    this.$filterContainer = elements.$filterContainer || $('#desktop-filters');
    this.$priceRangeSlider =
      elements.$priceRangeSlider || $('#priceRangeSlider');

    this.generateQueryString = this.generateQueryString.bind(this);
    this.fetchProducts = this.fetchProducts.bind(this);
    this.updateFromToPrice = this.updateFromToPrice.bind(this);
    this.setSortType = this.setSortType.bind(this);
    this.resetListing = this.resetListing.bind(this);
  }

  setCategory(category) {
    this.category = category;
  }
  isFilterApplied(filter, filterItems) {
    return filter === 'price'
      ? Math.round(filterItems.from) !== Math.round(filterItems.min) ||
          Math.round(filterItems.to) !== Math.round(filterItems.max)
      : filterItems.filter(filterItem => filterItem.checked).length > 0;
  }

  updateFromToPrice(price_from, price_to) {
    debugger;
    this.price_from = price_from;
    this.price_to = price_to;
  }

  setSortType(sort_type) {
    this.sortType = sort_type;
  }

  callWishlistAPI($elm) {
    var strApiToCall = '';
    if (!$elm.hasClass('marked')) {
      strApiToCall = FAV_MARK_API + $elm.attr('sku');
    } else {
      strApiToCall = FAV_UNMARK_API + $elm.attr('sku');
    }

    $.ajax({
      type: 'GET',
      url: strApiToCall,
      dataType: 'json',
      success: function(data) {
        if (!$elm.hasClass('marked')) {
          $elm.addClass('marked');
        } else {
          $elm.removeClass('marked');
        }
      },
      error: function(jqXHR, exception) {
        console.log(jqXHR);
        console.log(exception);
      }
    });
  }

  renderFilters(filterData) {
    const _self = this;
    this.bNoMoreProductsToShow = false;
    this.$filterContainer.empty();
    for (var filter in filterData) {
      if (_self.filterToIgnore && filter === _self.filterToIgnore) {
        continue;
      }
      const filterItems = filterData[filter];
      const isPrice = filter === 'price';
      (isPrice ||
        (filterItems &&
          filterItems.length &&
          filterItems.filter(item => item.enabled).length)) &&
        this.$filterContainer.append(
          this.filterTemplate({
            name: filter,
            list: filterItems,
            isPrice,
            isApplied: this.isFilterApplied(filter, filterItems)
          })
        );
      if (isPrice) {
        const data = filterData[filter];
        $('#priceRangeSlider').ionRangeSlider({
          skin: 'sharp',
          type: 'double',
          min: data.min ? data.min : 0,
          max: data.max ? data.max : 10000,
          from: data.from ? data.from : data.min,
          to: data.to ? data.to : data.max,
          prefix: '$',
          prettify_separator: ',',
          onStart: function(data) {
            // fired then range slider is ready
          },
          onChange: function(data) {
            // fired on every range slider update
          },
          onFinish: function(data) {
            // fired on pointer release
            _self.updateFromToPrice(
              $('#priceRangeSlider').data('from'),
              $('#priceRangeSlider').data('to')
            );
            _self.resetListing();
          },
          onUpdate: function(data) {
            // fired on changing slider with Update method
          }
        });
      }
    }

    if (!isMobile()) {
      this.$filterContainer.append(
        '<a class="clearall-filter-btn" href="#" id="clearAllFiltersBtn">Clear All</a>'
      );
    }

    if (this.strFilters) {
      $('.clear-all').addClass('show');
      $('.clear-all-btn').addClass('show');
    } else {
      $('.clear-all').removeClass('show');
      $('.clear-all-btn').removeClass('show');
    }
  }

  generateQueryString() {
    let strFilters = '';
    const _self = this;
    $('.filter').each(function() {
      if ($(this).attr('id') === 'price') {
        if (_self.price_from) {
          strFilters += 'price_from:' + _self.price_from + ';';
        }
        if (_self.price_to) {
          strFilters += 'price_to:' + _self.price_to + ';';
        }
      } else {
        var currFilter = $(this).attr('data-filter');
        strFilters += currFilter + ':';
        var bFirstChecked = false;
        $(this)
          .find('input[type="checkbox"]')
          .each(function(idx) {
            if (this.checked) {
              var delim;
              if (!bFirstChecked) {
                delim = '';
                bFirstChecked = true;
              } else {
                delim = ',';
              }
              strFilters += delim + $(this).attr('value');
            }
          });
        strFilters += ';';
      }
    });
    var typeFilter = $('.browse-filter-item.active').attr('data-type');
    if (typeFilter) {
      this.strFilters = `${strFilters}${typeFilter}=true;category:${this.category}`;
    } else {
      this.strFilters = `${strFilters}category:${this.category}`;
    }

    return this.strFilters;
  }

  fetchProducts(bClearPrevProducts) {
    this.bFetchingProducts = true;
    const _self = this;
    var strLimit = this.iLimit === undefined ? '' : '&limit=' + this.iLimit;
    var filterQuery = `?filters=${this.strFilters}&sort_type=${this.sortType}&pageno=${this.iPageNo}${strLimit}&board-view=true`;
    var listingApiPath = this.base_url + filterQuery;
    if (bClearPrevProducts) {
      $('.products')
        .children('.flex-grid')
        .empty();
    }
    $('.spinner-loader').addClass('show');

    _self.iPageNo += 1;
    $.ajax({
      type: 'GET',
      url: listingApiPath,
      dataType: 'json',
      success: function(data) {
        listingApiRendering(data);
      },
      error: function(jqXHR, exception) {
        _self.bFetchingProducts = false;
        console.log(jqXHR);
        console.log(exception);
      }
    });
    const listingApiRendering = function(data) {
      _self.bFetchingProducts = false;
      let totalResults = 0;
      $('.spinner-loader').removeClass('show');
      $('.js-load-more').show();
      if (bClearPrevProducts) {
        _self.$productContainer.empty();
      }
      //$('#loaderImg').hide();
      if (data == null) {
        return;
      }

      if (data.products && data.products.length) {
        remoteProducts = data.products;
        _self.bNoMoreProductsToShow = true;

        totalResults = data.total;
        _self.$totalResults.text(totalResults);

        var anchor = $('<a/>', {
          href: '#page' + _self.iPageNo,
          id: '#anchor-page' + _self.iPageNo
        }).appendTo('#productsContainerDiv');

        if (_self.iPageNo === 1) {
          $('.products')
            .children('.flex-grid')
            .html(_self.listingTemplate({ products: data.products }));
        } else {
          $('.products')
            .children('.flex-grid')
            .append(_self.listingTemplate({ products: data.products }));
        }
        delete data.filterData.category;
        if (data.filterData) {
          function getKeysToRender(filterData) {
            return Object.keys(data.filterData).filter(key => {
              return (
                key === 'price' ||
                (filterData[key] &&
                  filterData[key].length &&
                  filterData[key].filter(item => item.enabled).length)
              );
            });
          }
          $('.js-filter-section').html(
            _self.filterTemplate({
              filterData: data.filterData,
              filterKeys: getKeysToRender(data.filterData)
            })
          );
          const { price } = data.filterData;
          $('#priceRangeSlider').ionRangeSlider({
            skin: 'sharp',
            type: 'double',
            min: price.min ? price.min : 0,
            max: price.max ? price.max : 10000,
            from: price.from ? price.from : price.min,
            to: price.to ? price.to : price.max,
            prefix: '$',
            prettify_separator: ',',
            onStart: function(data) {
              // fired then range slider is ready
            },
            onChange: function(data) {
              // fired on every range slider update
            },
            onFinish: function(data) {
              // fired on pointer release
              _self.updateFromToPrice(
                $('#priceRangeSlider').data('from'),
                $('#priceRangeSlider').data('to')
              );
              _self.resetListing();
            },
            onUpdate: function(data) {
              // fired on changing slider with Update method
            }
          });
        }
      } else {
        _self.bNoMoreProductsToShow = true;
        $('.js-load-more').hide();
        _self.iPageNo -= 1;
        $('.products')
          .children('.flex-grid')
          .text('No products found');
      }

      if (data.sortType) {
        $('#sort').empty();
        data.sortType.forEach(element => {
          var sortElm = jQuery('<option />', {
            value: element.value,
            selected: element.enabled,
            text: element.name
          }).appendTo('#sort');
          if (element.enabled) {
            strSortType = element.value;
          }
        });
      }
    };
  }

  resetListing() {
    this.iPageNo = 0;
    this.generateQueryString();
    this.fetchProducts(true);
    $('.js-load-more').hide();
  }
}
$(document).ready(function() {
  $('.js-load-more').hide();
  const productTemplate = Handlebars.compile($('#products').html());
  const filterTemplate = Handlebars.compile($('#filter-template').html());
  const listingFactory = new ListingFactory(
    'https://lazysuzy.com/api/products/all',
    // "http://staging.lazysuzy.com/api/products/all",
    { filterToIgnore: 'category' },
    {},
    productTemplate,
    filterTemplate
  );

  $('body').on('click', '.category-label', function() {
    const category = $(this).attr('data-category');
    $('.custom-products').removeClass('show');
    $('.js-category-title').text($(this).text());
    $(".nav-link[href='#browse']").click();
    listingFactory.setCategory(category);
    listingFactory.resetListing();
  });

  $('body').on('click', '.clear-all', function() {
    $('.filter').each(function() {
      if ($(this).attr('id') === 'priceFilter') {
        listingFactory.updateFromToPrice(
          $(this).data('from'),
          $(this).data('to')
        );
      } else {
        $(this)
          .find('input[type="checkbox"]')
          .each(function() {
            if (this.checked) {
              this.checked = false;
            }
          });
      }
    });
    $('.browse-filter-item.active').removeClass('active');
    listingFactory.resetListing();
  });

  /***************Implementation of filter changes **************/
  $('body').on('change', '.filter input[type="checkbox"]', function() {
    listingFactory.resetListing();
  });

  $('.browse-filter-item').click(function() {
    $('.browse-filter-item.active').removeClass('active');
    $(this).addClass('active');

    listingFactory.resetListing();
  });

  $('.js-load-more').click(function() {
    listingFactory.fetchProducts(false);
    $(this).hide();
  });
});
