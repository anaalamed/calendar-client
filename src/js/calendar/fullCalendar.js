import { Calendar } from "@fullcalendar/core";
import adaptivePlugin from "@fullcalendar/adaptive";
import interactionPlugin from "@fullcalendar/interaction";
import dayGridPlugin from "@fullcalendar/daygrid";
import listPlugin from "@fullcalendar/list";
import timeGridPlugin from "@fullcalendar/timegrid";
import momentPlugin from "@fullcalendar/moment";
import resourceTimelinePlugin from "@fullcalendar/resource-timeline";
import { events } from "./data";
import { addEvent, initCalendar } from "./calendar";
import pubSub from "./pubsub";
import axios from "axios";
import { serverAddress } from "../constants";

let calendar;
const initFullCal = () => {
  console.log("initFullCal");
  // $("#eventEditModal").modal("show"); // modal debug

  $(document).ready(function () {
    let calendarEl = document.getElementById("calendar");

    calendar = new Calendar(calendarEl, {
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
            $("#organizerField").text(sessionStorage.getItem("currentUser"));
            $("#adminUsers").empty();
            $("#guestUsers").empty();
            $("#editModalTitle").val("");
            $("#date").val("");
            $("#time").val("");
            $("#checkbox").val("");
            $("#location").val("");
            $("#duration").val("");
            $("#description").val("");

            $(document).on("click", "#eventEditModal .modal-footer button", function (event) {

              calendar.addEvent({
                title: $("#editModalTitle").val(),
                start: $("#date").val() + "T" + $("#time").val(),
                end: "2022-12-19T20:00:00",
                extendedProps: {
                  public: $("#checkbox").is(":checked"),
                  location: $("#location").val(),
                  organizer: sessionStorage.getItem("currentUser"),
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
    calendarEl = $('#calendar');
    //getAllEventsByUser(sessionStorage.getItem("userId"))
    $(document).ready(function () {

      const FetchPromise = axios({
        method: "GET",
        url: serverAddress + "/event/getEventsByUserId",
        headers: {
          "Content-Type": "application/json",
          token: sessionStorage.getItem("token"),
        },
        data: {},
      });

      FetchPromise.then((res) => {
        let myNewEvents = res.data.data;


        for (let i = 0; i < res.data.data.length; i++) {
          
          myNewEvents[i].start = myNewEvents[i].time;
          myNewEvents[i].myDuration = myNewEvents[i].duration;
          var myHour = new Date(myNewEvents[i].time).getHours();
          var myMin = new Date(myNewEvents[i].time).getMinutes();
          var myDuration2 = myNewEvents[i].duration;
          var calEnd = new Date (myNewEvents[i].time).setHours(myHour + myDuration2, (myHour + myDuration2 - (myHour + parseInt(myDuration2))) * 60 + myMin);
        
          myNewEvents[i].end = calEnd;
        }
        console.log(myNewEvents);
        calendar.addEventSource(myNewEvents);///////////
        
      }).catch((error) => {
        console.log(error);
      });

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

 
  var theRoles = info.event.extendedProps.roles
  var organizer;
  var admins = [];
  var guests = [];
  sessionStorage.setItem("currentEventId",info.event.id);

  for (let i = 0; i < theRoles.length; i++) {
    if (theRoles[i].roleType == 'ORGANIZER')
      organizer = theRoles[i].user.email;
    else if (theRoles[i].roleType == 'ADMIN')
      admins.push(theRoles[i]);
    else 
      guests.push(theRoles[i]);
  }
  console.log(theRoles);
  console.log(organizer);
  console.log(admins);
  console.log(guests);

  //info.event.setEnd(info.event.start.setHours(myHour + myDuration, (myHour + myDuration - (myHour + parseInt(myDuration))) * 60 + myMin));
  $("#eventModal").modal("show");
  $(".modal-title").text(info.event._def.title);
  $(".row.field.public .content").text(info.event.extendedProps.public);
  $(".row.field.time .content").text(info.event.start.getHours() + ":" + info.event.start.getMinutes());
  $(".row.field.date .content").text(info.event.start.getFullYear() + "-" + (info.event.start.getMonth() + 1) + "-" + info.event.start.getDate());
  $(".row.field.duration .content").text(info.event.extendedProps.myDuration + " (Hours)");
  $(".row.field.location .content").text(info.event.extendedProps.location);
  $(".field.description .content").text(info.event.extendedProps.description);


  $(".field.organizer div").text(organizer);
  
  $("#adminUsersShow").empty();
  admins.forEach((admin) => {
    $(".field.admins div.listWrapper ul").append(`<li class="userWrpper">
    <div class="adminStatus">${admin.statusType}</div>
    <div class="adminEmail">${admin.user.email}</div>
    <div class="adminChangeRole">role</div>
    <div class="adminRemove">X</div>
    </li>`);
  });

  $("#guestUsersShow").empty();
  guests.forEach((guest) => {
    $(".field.guests div.listWrapper ul").append(`<li class="userWrpper">
    <div class="guestStatus">${guest.statusType}</div>
    <div class="guestEmail">${guest.user.email}</div>
    <div class="guestChangeRole">role</div>
    <div class="guestRemove">X</div>
    </li>`);
  });
};

export { initFullCal, calendar };
