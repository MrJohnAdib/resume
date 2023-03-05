$(document).ready(function () {
  var myDate = new Date().toLocaleString("en-us", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
  $("[data-fill-current]").text(myDate).attr("date", myDate);

  $("[data-fill]").on("click", function () {
    var fieldTitle = $(this).attr("data-fill");
    var fieldValue = $(this).text();
    var msg = "Enter new value for [ " + fieldTitle + " ]";
    var fieldSelector = "[data-fill='" + fieldTitle + "']";

    // get new value from propmt
    var newVal = window.prompt(msg, fieldValue);

    if (!newVal) {
      newVal = "[" + fieldTitle + "]";
    }

    // replace with new text on all part of docs
    $(fieldSelector).text(newVal).attr("data-fill-val", newVal);
  });
});
