import $ from "jquery";
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
      views: {
        resourceTimelineThreeDays: {
          type: "resourceTimeline",
          duration: { days: 3 },
          buttonText: "3 day",
        },
      },
      events: events,
      eventClick: function (info) {
        alert("Event: " + info.event.title);
        console.log("ext", info.event.extendedProps);

        // change the border color just for fun
        info.el.style.borderColor = "red";
      },
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

export { initFullCal };
