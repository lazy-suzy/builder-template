window.isMobile = function() {
  var check = false;
  (function(a) {
    if (
      /(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(
        a
      ) ||
      /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(
        a.substr(0, 4)
      )
    )
      check = true;
  })(navigator.userAgent || navigator.vendor || window.opera);

  return check;
};

$(document).ready(function() {
  Handlebars.registerHelper("ifEq", function(v1, v2, options) {
    if (v1 === v2) {
      return options.fn(this);
    }
    return options.inverse(this);
  });
  // $(".tool-bar-holder").hide();
  const template = Handlebars.compile($("#category").html());
  let products = [];
  const bottomPanelTemplate = Handlebars.compile($("#bottom-panel").html());
  $.ajax({
    url: "https://lazysuzy.com/api/all-departments?board-view=true",
    // url: "http://staging.lazysuzy.com/api/all-departments?board-view=true",
    context: document.body
  }).done(function(data) {
    $(".components")
      .children(".flex-grid")
      .append(template({ categories: data }));
  });

  $("body").on("click", ".js-bottom-panel-close", function() {
    $(".bottom-panel").html("");
  });

  $(".nav-link").click(function(event) {
    event.preventDefault();
    $(".nav-link").removeClass("active");
    $(this).addClass("active");
    $(".tab").removeClass("active");
    const target = $(this).attr("href");
    $(target).addClass("active");
    $(".left-panel").removeClass("board");
    $(".left-panel").addClass(target.split("#")[1]);
    if (target !== "#browse") {
      $(".custom-products").removeClass("show");
    }
    if (target === "#browse") {
      $(".spinner-loader").addClass("show");
    }
    if (target === "#favorites") {
      $(".static-bottom-panel").addClass("selected");
    } else {
      $(".static-bottom-panel.selected").removeClass("selected");
    }
    $(".mdi-chevron-left").click(function() {
      $(target).removeClass("active");
      $(".nav-link").removeClass("active");
      $("#select").addClass("active");
      $('[href*="#select"').addClass("active");
    });
  });

  $("body").on("click", ".product-image[type='default']", function() {
    const product = remoteProducts[$(this).attr("data-product")];
    product.index = $(this).attr("data-product");
    $(".bottom-panel").html(bottomPanelTemplate(product));
    // $(".tool-bar-holder").show();
  });

  $(".toggle-icon").click(function() {
    $(".toggle-icon").toggleClass("open");
    $(".left-panel").toggleClass("open");
  });
  
  // mobile window closed on item manual add click
  $("body").on("click", ".manual-drop", function() {
    $(".toggle-icon").toggleClass("open");
    $(".left-panel").toggleClass("open");
  });

  $(".filter-icon, .js-filter-close").click(function() {
    $(".mobile-filter").toggleClass("open");
  });

  $("body").on("click", ".tabs .nav-link", function(e) {
    e.preventDefault();
    $(".tab-pane.selected").removeClass("selected");
    $(".tabs .nav-link.selected").removeClass("selected");

    $(this).addClass("selected");
    $($(this).attr("href")).addClass("selected");
  });
  function toggleAddProduct(e) {
    e.preventDefault();
    $(".backdrop").toggleClass("show");
    $(".add-product-modal").toggleClass("show");
    $(".step").removeClass("active");
    $("#step1").addClass("active");
  }

  $(".js-addProduct, .close-modal").click(toggleAddProduct);

  $(".js-addUrl").click(function() {
    $(".add-product-modal").toggleClass("show");
    $(".backdrop").toggleClass("show");
    $("#step1").removeClass("active");
    $("#step2").addClass("active");
  });

  $(".js-confirmation-modal, .js-close-confirmation-modal").click(function(e) {
    e.preventDefault();
    $(".backdrop").toggleClass("show");
    $(".confirmation-modal").toggleClass("show");
  });

  $(".step .js-btn").click(function(e) {
    e.preventDefault();
    $(".step").removeClass("active");
    const target = $(this).attr("target");
    target ? $(target).addClass("active") : toggleAddProduct(e);
  });

  $(".toggle-catalog").click(function() {
    $(".catalog-panel").toggleClass("open");
  });

  $(".js-open-custom").click(function() {
    $(".custom-products").addClass("show");
    $(".nav-link[href='#browse']").click();
  });

  $(".js-btn-go").hide();

  $(".js-open-auth, .js-close-auth").click(function(e) {
    if (!isMobile()) {
      e.preventDefault();
      $(".backdrop").toggleClass("show");
      $(".open-auth").toggleClass("show");
    }
  });

  $(".js-open-background, .js-close-background-modal").click(function() {
    $(".backdrop").toggleClass("show");
    $(".background-modal").toggleClass("show");
  });
  // $(".js-font-select").fontselect();

  $(".text-items").click(function() {
    $(".text-items.selected").removeClass("selected");
    $(this).addClass("selected");
  });

  $(".add-new-title").click(function() {
    event.preventDefault();
    $(".add-new-title.active").removeClass("active");
    $(this).addClass("active");
    $(".items-board.active").removeClass("active");
    const target = $(this).attr("href");
    $("#" + target).addClass("active");
  });

  $(".close-background-msg").click(function() {
    $(".background-msg").addClass("hide");
  });

  $(".filter-icon").click(function() {
    $("#mobile-filter").addClass("js-filter-section");
    document.getElementById(
      "mobile-filter"
    ).innerHTML = document.getElementById("desktop-filter").innerHTML;
  });

  $("body").on("click", ".dropdown-toggle.selected", function() {
    $(this).removeClass("selected");
    $($(this).attr("href")).removeClass("selected");
  });

  $(".publish-board-room-items").click(function() {
    $(".publish-board-room-items.active").removeClass("active");
    $(this).addClass("active");
  });

  $(".publish-board-style-items").click(function() {
    $(".publish-board-style-items.active").removeClass("active");
    $(this).addClass("active");
  });

  $(".js-open-publish-board, .js-close-publish-board").click(function(e) {
    if (!isMobile()) {
      e.preventDefault();
      $(".backdrop").toggleClass("show");
      $(".publish-board").toggleClass("show");
    }
  });

  $("#submitBtn").click(function (e) {
    const email = $("#txt_email").val().trim();
    const password = $("#txt_pwd").val().trim();
    e.preventDefault();
    e.stopPropagation();
    $.ajax({
      url: "https://www.lazysuzy.com/api/login",
      type: 'post',
      data: {
        email: email,
        password: password
      },
      success: function (response) {
        // TODO: After Login Success
        processAuthSuccess(response);
      }
    });

  });

  function processAuthSuccess(response){
    //Save token and refresh page elements
    const user = response.user;
    const token = response.success.token;

    //Close modal
    $(".backdrop").toggleClass("show");
    $(".open-auth").toggleClass("show");    
  }
  

});
