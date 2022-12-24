import { getAllEventsByUser, inviteGuest, saveNewEvent, removeGuest } from "../rest";
import { calendar } from "./fullCalendar";
import pubSub from "./pubsub";

var addGuests = [];

const cleanAddModalFields = () => {
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
};

// click on the event
const eventClickHandler = (info) => {
  console.log(info);
  var theRoles = info.event.extendedProps.roles;
  var organizer;
  var admins = [];
  var guests = [];
  sessionStorage.setItem("currentEventId", info.event.id);

  for (let i = 0; i < theRoles.length; i++) {
    if (theRoles[i].roleType == "ORGANIZER") organizer = theRoles[i].user.email;
    else if (theRoles[i].roleType == "ADMIN") admins.push(theRoles[i]);
    else guests.push(theRoles[i]);
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

const initCalendar = () => {
  $(document).ready(function () {
    // get events of user on load calendar page
    getAllEventsByUser(sessionStorage.getItem("userId"));

    // change date from side calendar
    pubSub.subscribe("anEvent", (date) => {
      calendar.gotoDate(date);
    });
  });

  // create new event
  $(document).on("click", "#SaveNewEventBtn", (event) => {
    console.log("Inside add new event!");
    event.preventDefault();

    // add to fullCalendar
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

    // add to server
    const eventToAdd = {
      title: $(".title").val(),
      time: $("#date").val() + "T" + $("#time").val(),
      date: $("#date").val(),
      myDuration: $("#duration").val(),
      location: $("#location").val(),
      description: $("#description").val(),
      organizer: sessionStorage.getItem("currentUser"),
      public: $("#checkbox").is(":checked"),
    };

    saveNewEvent(eventToAdd, addGuests);
  });

  // add guest
  $(document).on("click", "#eventAddGuest", (event) => {
    console.log("Inside add guest to event (event modal)");
    event.preventDefault();
    const email = $(".row.addGuest input");
    addGuests.push(email.val());
    console.log($(".row.addGuest input").val());
    $(".field.guests .listWrapper ul").append(`<li class="userWrpper">
      <div class="guestStatus">status</div>
      <div class="guestEmail">${email.val()}</div>
      <div class="guestChangeRole">role</div>
      <div class="guestRemove">X</div>
    </li>`);

    //inviteGuest(email.val());

    email.val("");
  });

  // remove guest
  $(document).on("click", ".guestRemove", (event) => {
    console.log("Inside Remove Guest From Event!");
    event.preventDefault();

    const email = $("#guestEmail").val();

    console.log(sessionStorage.getItem("userId"));
    removeGuest(email);
  });

  // request is not implemented for:
  // - change role,
};

export { initCalendar, cleanAddModalFields, eventClickHandler };
