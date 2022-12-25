import $ from "jquery";
import { updateCity, updateNotificationsSettings } from "../rest";

const initSettings = () => {
  console.log("initSettings");

  //   $(document)
  //     .off("click")
  //     .on("click", "#updateCity", function () {
  //       // remove previous eventHandler
  //     });

  $(document).on("click", "#updateCity", (event) => {
    event.preventDefault();
    console.log("update city");

    const city = $("form#settingsLocation div select#city").val();
    console.log(city);
    updateCity(city);
  });

  //   $(document)
  //     .off("click")
  //     .on("click", "#updateNotSetBtn", function () {
  //       // remove previous eventHandler
  //     });

  $(document).on("click", "#updateNotSetBtn", function (event) {
    console.log("updateNotSet");
    event.preventDefault();

    const settings = {
      event_changed: $("form#settings div select#EVENT_CHANGED").val(),
      invite_guest: $("form#settings div select#INVITE_GUEST").val(),
      uninvite_guest: $("form#settings div select#UNINVITE_GUEST").val(),
      user_status: $("form#settings div select#USER_STATUS_CHANGED").val(),
      user_role: $("form#settings div select#USER_ROLE_CHANGED").val(),
      cancel_event: $("form#settings div select#CANCEL_EVENT").val(),
      upcoming_event: $("form#settings div select#UPCOMING_EVENT").val(),
      notificationRange: $("form#settings div select#notificationRangeSelect").val(),
    };
    console.log(settings);
    updateNotificationsSettings(settings);
  });
};

export { initSettings };
