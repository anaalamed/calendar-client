import { Calendar } from "@fullcalendar/core";
import adaptivePlugin from "@fullcalendar/adaptive";
import interactionPlugin from "@fullcalendar/interaction";
import dayGridPlugin from "@fullcalendar/daygrid";
import listPlugin from "@fullcalendar/list";
import timeGridPlugin from "@fullcalendar/timegrid";
import momentPlugin from "@fullcalendar/moment";
import resourceTimelinePlugin from "@fullcalendar/resource-timeline";
import { cleanAddModalFields, eventClickHandler } from "./calendar";

let calendar;
const initFullCal = () => {
  console.log("initFullCal");
  // $("#eventEditModal").modal("show"); // modal debug
  // $("#eventModal").modal("show"); // modal debug

  $(document).ready(function () {
    let calendarEl = document.getElementById("calendar");

    calendar = new Calendar(calendarEl, {
      plugins: [adaptivePlugin, interactionPlugin, dayGridPlugin, listPlugin, timeGridPlugin, resourceTimelinePlugin, momentPlugin],
      titleFormat: "MM/YYYY",
      schedulerLicenseKey: "XXX",
      now: momentPlugin.now,
      allDaySlot: false,
      slotDuration: "01:00:00",
      editable: true, // enable draggable events
      aspectRatio: 1.8,
      scrollTime: "00:00", // undo default 6am scrollTime
      headerToolbar: {
        left: "today addEventButton",
        center: "title",
        right: "prev,next timeGridDay,timeGridWeek,dayGridMonth,listWeek",
      },
      nowIndicator: true,
      initialView: "timeGridWeek",
      views: {},
      resources: [
        {
          id: sessionStorage.getItem("userId"),
        },
      ],
      // events: events,
      customButtons: {
        addEventButton: {
          text: "Add Event",
          click: function () {
            $("#eventEditModal").modal("show"); // modal debug
            cleanAddModalFields();
          },
        },
      },
      // timeZone: 'America/New_York',

      eventClick: (info) => eventClickHandler(info),
    });

    calendar.render();
  });
};

export { initFullCal, calendar };
