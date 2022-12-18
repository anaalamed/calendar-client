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
  // $("#eventModal").modal("show"); // modal debug

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
      // timeZone: 'America/New_York',

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
  console.log("info", info.event);
  console.log("ext", info.event.extendedProps);
  console.log("type ", typeof info.event._instance.range.start);
  console.log("value ", info.event._instance.range.start);

  $("#eventModal").modal("show");
  $(".modal-title").text(info.event._def.title);
  $(".row.field.public .content").text(info.event.extendedProps.public);
  // $(".row.field.time .content").text(info.event._instance.range.start.toUTCString);
  // $(".row.field.date .content").text(info.event._instance.range.start);
  // $(".row.field.duration .content").text(info.event._instance.range.start);
  $(".row.field.location .content").text(info.event.extendedProps.location);
  $(".field.description .content").text(info.event.extendedProps.description);

  $(".field.organizer div").text(info.event.extendedProps.organizer);
  const admins = info.event.extendedProps.admins;
  const guests = info.event.extendedProps.guests;

  admins.forEach((admin) => {
    $(".field.admins div.listWrapper ul").append(`<li>${admin}</li>`);
  });

  guests.forEach((guest) => {
    $(".field.guests div.listWrapper ul").append(`<li>${guest}</li>`);
  });
};

export { initFullCal };
