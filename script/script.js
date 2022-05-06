$(document).ready(function(){

  $('[data-fill]').on('click', function(){
    var fieldTitle = $(this).attr('data-fill');
    var fieldValue = $(this).text();
    var msg = "Enter new value for [ " +fieldTitle + " ]"
    var fieldSelector = "[data-fill='" + fieldTitle + "']";

    // get new value from propmt
    var newVal = window.prompt(msg, fieldValue);

    if(!newVal)
    {
      newVal = "[" + fieldTitle + "]";
    }

    // replace with new text on all part of docs
    $(fieldSelector).text(newVal).attr('data-fill-val', newVal);
  });

});
