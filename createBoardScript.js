$(document).ready(function() {
  $('.js-btn-go').hide();

  $('.canvas-style').click(function() {
    $('.modal-action').addClass('selected');
    $('.canvas-style').removeClass('selected');
    $(this).addClass('selected');
    $('.js-btn-go').show();
    $('.canvas-options').addClass('d-none');
    $($(this).attr('target')).removeClass('d-none');
  });

  $('.canvas-pallete-color').click(function() {
    $('.canvas-pallete-color.selected').removeClass('selected');
    $(this).addClass('selected');
  })

  $('.canvas-pallete-carpet-patterns').click(function() {
    $('.canvas-pallete-carpet-patterns.selected').removeClass('selected');
    $(this).addClass('selected');
  })
  
  $('.canvas-pallete-wood-patterns').click(function() {
    $('.canvas-pallete-wood-patterns.selected').removeClass('selected');
    $(this).addClass('selected');
  })

});