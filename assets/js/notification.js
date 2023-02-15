$.extend({
  notification: function (type, message, time) {
    // error, success, warning
    $(".notification").attr("type", type);
    $(".notification .message").text(message);
    $(".notification").removeClass("off");
    setTimeout(function () {
      $(".notification").addClass("off");
    }, time);
  }
});
