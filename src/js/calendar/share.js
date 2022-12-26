const initShare = () => {
  // Create Checkboxes
  var checkboxContainer = $(`<div class='checkboxContainer'><label for='normal' style="margin-right: 10%;">${sessionStorage.getItem("currentUser")}</label><input type='checkbox' id=${sessionStorage.getItem("userId")} checked></br>`);

  // Append it to FullCalendar.
  $(".side_wrapper .calendar").after(checkboxContainer);

  // Click handler
  $(`#${sessionStorage.getItem("userId")}`).on("click", function () {
    if ($(this).is(":checked")) {
      console.log("11111");
      //$('#calendar').find(".fc-event").show();
      $("#calendar")
        .find("." + $(this).attr("id"))
        .show();
    } else {
      console.log("00000");
      $("#calendar")
        .find("." + $(this).attr("id"))
        .hide();
    }
  });
};

export { initShare };
