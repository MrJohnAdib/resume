$(document).ready(function(){

  $('[data-fill]').on('click', function(){
    var fieldTitle = $(this).attr('data-fill');
    var fieldValue = $(this).text();
    var msg = "Enter new value for [ " +fieldTitle + " ]"

    // get new value from propmt
    var newVal = window.prompt(msg, fieldValue);

    if(!newVal)
    {
      newVal = "[" + fieldTitle + "]";
    }

    $(this).text(newVal);
  });

});
