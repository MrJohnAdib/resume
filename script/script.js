$(document).ready(function(){

  $('[data-fill]').on('click', function(){
    var fieldTitle = $(this).attr('data-fill');
    var fieldValue = $(this).text();

    // get new value from propmt
    var newVal = window.prompt(fieldTitle, fieldValue);

    $(this).text(newVal);
  });

});
