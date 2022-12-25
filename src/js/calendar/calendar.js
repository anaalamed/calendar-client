import { data } from "jquery";
import { updateEvent,getAllEventsByUser, inviteGuest, saveNewEvent, removeGuest } from "../rest";
import { calendar } from "./fullCalendar";
import pubSub from "./pubsub";

var addGuests = [];
var currentEventInfo;
var organizer;
var admins = [];
var guests = [];


// click on the event
const eventClickHandler = (info) => {

  admins = [];
  guests = [];

  console.log(info);
  currentEventInfo = info;
  var theRoles = info.event.extendedProps.roles;

  sessionStorage.setItem("currentEventId", info.event.id);

  for (let i = 0; i < theRoles.length; i++) {
    if (theRoles[i].roleType == "ORGANIZER") organizer = theRoles[i].user;
    else if (theRoles[i].roleType == "ADMIN") admins.push(theRoles[i]);
    else guests.push(theRoles[i]);
  }
  
  console.log(organizer);
  console.log(admins);
  console.log(guests);

  $("#eventModal").modal("show");
  $(".modal-title").text(info.event._def.title);
  $(".row.field.public .content").text(info.event.extendedProps.public);
  $(".row.field.time .content").text(info.event.start.getHours() + ":" + info.event.start.getMinutes());
  $(".row.field.date .content").text(info.event.start.getFullYear() + "-" + (info.event.start.getMonth() + 1) + "-" + info.event.start.getDate());
  $(".row.field.duration .content").text(info.event.extendedProps.myDuration + " (Hours)");
  $(".row.field.location .content").text(info.event.extendedProps.location);
  $(".field.description .content").text(info.event.extendedProps.description);

  $(".field.organizer div").text(organizer.email);

  $("#adminUsersShow").empty();
  admins.forEach((admin) => {
    console.log(admin);
    $(".field.admins div.listWrapper ul").append(renderUserinList(admin));
  });

  $("#guestUsersShow").empty();
  guests.forEach((guest) => {
    console.log(guest);
    $(".field.guests div.listWrapper ul").append(renderUserinList(guest));
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

    // remove guest
    $(document).on("click", ".guestRemove", function (event) {
      console.log("Inside Remove Guest From Event!");
      event.preventDefault();

      const email = $(this).siblings(".guestEmail").text();
      console.log("userId token", sessionStorage.getItem("userId"));
      console.log("delete res: " + removeGuest(email));
    });
  });

  $(document)
    .off("click")
    .on("click", "#btnSignup", function () {
      // remove previous eventHandker
    });
  // create new event
  $(document).on("click", ".new #SaveNewEventBtn", (event) => {
    console.log("Inside add new event!");
    event.preventDefault();

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

  // edit event
  $(document).on("click", "#editEventButton", (event) => {
    event.preventDefault();

    $("#eventEditModal").modal("show");
    cleanAddModalFields();
    console.log(currentEventInfo);
    $("#editModalTitle.title").val(currentEventInfo.event._def.title);
    if (currentEventInfo.event.extendedProps.public)
      $('#checkbox').prop('checked', true);

    console.log("0" + currentEventInfo.event.start.getHours() + ":" + currentEventInfo.event.start.getMinutes());
    if (currentEventInfo.event.start.getHours() < 10)
      $("#time").val("0" + currentEventInfo.event.start.getHours() + ":" + currentEventInfo.event.start.getMinutes() + "0");
    else if (currentEventInfo.event.start.getMinutes() < 10)
      $("#time").val(currentEventInfo.event.start.getHours() + ":" + currentEventInfo.event.start.getMinutes() + "0");
    else
      $("#time").val(currentEventInfo.event.start.getHours() + ":" + currentEventInfo.event.start.getMinutes());

    $("#date").val(currentEventInfo.event.start.getFullYear() + "-" + (currentEventInfo.event.start.getMonth() + 1) + "-" + currentEventInfo.event.start.getDate());
    $("#duration").val(currentEventInfo.event.extendedProps.myDuration);
    $("#location").val(currentEventInfo.event.extendedProps.location);
    $("#description").val(currentEventInfo.event.extendedProps.description);
    
    $("#organizerField").text(organizer.email);

    $("#adminUsersShow").empty();
    admins.forEach((admin) => {
      $(".field.admins div.listWrapper ul").append(renderUserinList(admin));
    });

    $("#guestUsersShow").empty();
    guests.forEach((guest) => {
      $(".field.guests div.listWrapper ul").append(renderUserinList(guest));
    });



    //check if the user guest
    for (let i = 0; i < guests.length; i++)
      if (guests[i].user.id == sessionStorage.getItem("userId")) {
        $(".modal-content").addClass("guest");
      }


    //check if the user admin
    for (let i = 0; i < admins.length; i++)
      if (admins[i].user.id == sessionStorage.getItem("userId")) {
        $(".modal-content").addClass("admin");
      }


    //check if the user orginaizer
      console.log(organizer)
    // if (organizer.id == sessionStorage.getItem("userId")) {
    //   $(".modal-content").removeClass("admin");
    //   $(".modal-content").removeClass("guest");
    // }

    $(".modal-content").removeClass("new");
    $(".modal-content").addClass("edit");

    // not implenented !!!
    // - get the event data - place in the right fields
    // - save updated
    // close 2 modals
  });
//update event 
$(document).on("click", ".edit #SaveNewEventBtn", (event) => {
  console.log("Inside update event!");
  event.preventDefault();
  
  // add to server
  const eventToAdd = {
    title: $("#editModalTitle").val(),
    // time: $("#date").val() + "T" + $("#time").val(),
    // date: $("#date").val(),
    myDuration: $("#duration").val(),
    location: $("#location").val(),
    description: $("#description").val(),
    organizer: sessionStorage.getItem("currentUser"),
    public: $("#checkbox").is(":checked"),
  };

  updateEvent(eventToAdd, addGuests);

});





















  // add guest - (event modal)
  $(document).on("click", "#eventAddGuest", (event) => {
    console.log("Inside add guest to event (event modal)");
    event.preventDefault();
    const email = $(".row.addGuest input").val();
    console.log(email);
    // addGuests.push(email);
    inviteGuest(email);

    // $(".field.guests div.listWrapper ul").append(renderUserinList(guest));

    $(".row.addGuest input").val("");
  });

  // request is not implemented for:
  // - change role,
};

// ------------------------- utils functions ------------------------------
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

const renderUserinList = (user) => {
  console.log(user);
  let status = "";
  let statusClass = "";
  switch (user.statusType) {
    case "TENTATIVE":
      status = "?";
      statusClass = "tentative";
      break;
    case "APPROVED":
      status = "V";
      statusClass = "approved";
      break;
    case "REJECTED":
      status = "X";
      statusClass = "rejected";
      break;
    default:
    // code block
  }

  const userType = user.roleType.toLowerCase();
  const email = user.user.email;
  return `<li class="userWrpper">
  <div class="${userType}Status ${statusClass}">${status}</div>
  <div class="${userType}Email">${email}</div>
  <div class="${userType}ChangeRole"><i class="bi bi-arrow-down-up"></i></div>
  <div class="${userType}Remove"><i class="bi bi-trash"></i></div>
  </li>`;
};

export { initCalendar, cleanAddModalFields, eventClickHandler, renderUserinList };
