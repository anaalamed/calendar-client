import { Calendar } from "@fullcalendar/core";
import adaptivePlugin from "@fullcalendar/adaptive";
import interactionPlugin from "@fullcalendar/interaction";
import dayGridPlugin from "@fullcalendar/daygrid";
import listPlugin from "@fullcalendar/list";
import timeGridPlugin from "@fullcalendar/timegrid";
import momentPlugin from "@fullcalendar/moment";
import resourceTimelinePlugin from "@fullcalendar/resource-timeline";
import { events } from "./data";
import { addEvent } from "./event";
import pubSub from "./pubsub";
import { duration } from "moment";

const initFullCal = () => {
  console.log("initFullCal");
  // $("#eventEditModal").modal("show"); // modal debug

  $(document).ready(function () {
    let calendarEl = document.getElementById("calendar");

    let calendar = new Calendar(calendarEl, {
      plugins: [adaptivePlugin, interactionPlugin, dayGridPlugin, listPlugin, timeGridPlugin, resourceTimelinePlugin, momentPlugin],
      titleFormat: "MM/YYYY",
      schedulerLicenseKey: "XXX",
      now: momentPlugin.now,
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
      events: events,
      customButtons: {
        addEventButton: {
          text: "Add Event",
          click: function () {
            $("#eventEditModal").modal("show"); // modal debug

            $(document).on("click", "#eventEditModal .modal-footer button", function (event) {
              console.log($(".modal-header .title").val());

              calendar.addEvent({
                title: $("#eventEditModal .modal-header .title").val(),
                start: $("#date").val()+"T"+$("#time").val(),
                end: "2022-12-19T20:00:00",
                extendedProps: {
                  public: $("#checkbox").is(':checked'),
                  location: $("#location").val(),
                  guests: ["ana", "leon"],
                  admins: ["mostafa", "assaf", "tzahi", "leon"],
                  organizer: "mostafa",
                  duration: $("#duration").val(),
                },
                description: $("#description").val(),
              });
            });
          },
        },
      },
      // timeZone: 'America/New_York',

      
      eventClick: (info) => eventHandler(info),
    });

    // events of the user
    var userEvents = calendar.currentDataManager.props.optionOverrides.events;
    userEvents[0].end = "2022-12-18T05:00:00";
    console.log(userEvents);
    // const start = new Date(userEvents[0].start);
    // console.log(userEvents[0]);
    // userEvents[0].end = start.setHours(5);
    // userEvents[0].end = userEvents[0].end.toISOString();
    // console.log(userEvents[0]);

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
  var myHour = info.event.start.getHours();
  var myMin = info.event.start.getMinutes();
  var myDuration = info.event.extendedProps.duration;
  console.log("duration ", myHour);

  //info.event.setEnd(info.event.start.setHours(myHour + myDuration, (myHour + myDuration - (myHour + parseInt(myDuration))) * 60 + myMin));
  $("#eventModal").modal("show");
  $(".modal-title").text(info.event._def.title);
  $(".row.field.public .content").text(info.event.extendedProps.public);
  $(".row.field.time .content").text(info.event.start.getHours() + ":" + info.event.start.getMinutes());
  $(".row.field.date .content").text(info.event.start.getFullYear() + "-" + (info.event.start.getMonth() + 1) + "-" + info.event.start.getDate());
  $(".row.field.duration .content").text(info.event.extendedProps.duration + " (Hours)");
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
