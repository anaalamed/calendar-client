import $ from "jquery";
// import * as $ from "jquery";
// import "bootstrap";

import { Calendar } from "@fullcalendar/core";
import adaptivePlugin from "@fullcalendar/adaptive";
import interactionPlugin from "@fullcalendar/interaction";
import dayGridPlugin from "@fullcalendar/daygrid";
import listPlugin from "@fullcalendar/list";
import timeGridPlugin from "@fullcalendar/timegrid";
import momentPlugin from "@fullcalendar/moment";
import resourceTimelinePlugin from "@fullcalendar/resource-timeline";
import { events } from "./data";
import pubSub from "./pubsub";

const initFullCal = () => {
  console.log("initFullCal");

  $(document).ready(function () {
    let calendarEl = document.getElementById("calendar");

    let calendar = new Calendar(calendarEl, {
      plugins: [adaptivePlugin, interactionPlugin, dayGridPlugin, listPlugin, timeGridPlugin, resourceTimelinePlugin, momentPlugin],
      // titleFormat: "DD/MM/YYYY",
      schedulerLicenseKey: "XXX",
      now: momentPlugin.now,
      editable: true, // enable draggable events
      aspectRatio: 1.8,
      scrollTime: "00:00", // undo default 6am scrollTime
      headerToolbar: {
        left: "today prev,next",
        center: "title",
        right: "timeGridDay,timeGridWeek,dayGridMonth,listWeek",
      },
      initialView: "timeGridWeek",
      views: {},
      events: events,
      eventClick: (info) => eventHandler(info),
    });

    calendar.render();

    // change date from side calendar
    pubSub.subscribe("anEvent", (date) => {
      console.log("subscrive");
      console.log(date);
      calendar.gotoDate(date);
    });
  });
};

const eventHandler = (info) => {
  // alert("Event: " + info.event.title);
  console.log("ext", info.event.extendedProps);

  jQuery.noConflict();
  console.log($("#modal"));
  $("#modal").addClass("show");
  // $("#modal").modal({
  //   keyboard: false,
  // });
  // $("#modal").modal("show");
  $("#modal").on("shown.bs.modal", function () {
    console.log("boom");
  });
  // window.$("#modal").modal("show");

  // change the border color just for fun
  info.el.style.borderColor = "red";
};

export { initFullCal };