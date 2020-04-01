function setCookie(name, value, days = 1) {
  var expires = '';
  if (days) {
    var date = new Date();
    date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
    expires = '; expires=' + date.toUTCString();
  }
  document.cookie = name + '=' + (value || '') + expires + '; path=/';
}
function getCookie(name) {
  var nameEQ = name + '=';
  var ca = document.cookie.split(';');
  for (var i = 0; i < ca.length; i++) {
    var c = ca[i];
    while (c.charAt(0) == ' ') c = c.substring(1, c.length);
    if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length, c.length);
  }
  return null;
}

$(document).ready(function() {
  function setUserName() {
    $('.auth-link').hide();
    $('.name-link').show();
    const user = JSON.parse(localStorage.getItem('user'));
    $('.js-userName').text(user.name);
  }

  $('.js-open-auth, .js-close-auth').click(function(e) {
    if (!isMobile()) {
      e.preventDefault();
      $('.backdrop').toggleClass('show');
      $('.open-auth').toggleClass('show');
    }
  });

  $('.js-logout').click(() => {
    setCookie('token', '');
    window.location.reload();
  });

  $('#submitBtn').click(function(e) {
    const email = $('#txt_email')
      .val()
      .trim();
    const password = $('#txt_pwd')
      .val()
      .trim();
    e.preventDefault();
    e.stopPropagation();
    $.ajax({
      url: 'https://www.lazysuzy.com/api/login',
      type: 'post',
      data: {
        email: email,
        password: password
      },
      success: function(response) {
        // TODO: After Login Success
        processAuthSuccess(response);
      }
    });
  });

  function processAuthSuccess(response) {
    //Save token and refresh page elements
    const user = response.user;
    const token = response.success.token;
    setCookie('token', token, 1);
    localStorage.setItem('user', JSON.stringify(user));
    setUserName();
    //Close modal

    $('.backdrop').toggleClass('show');
    $('.open-auth').toggleClass('show');
  }

  //check if user exists
  if (getCookie('token')) {
    setUserName();
  }
});
