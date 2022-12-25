import { data } from "jquery";
import { getAllEventsByUser, inviteGuest, saveNewEvent, removeGuest } from "../rest";
import { calendar } from "./fullCalendar";
import pubSub from "./pubsub";

var addGuests = [];

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

  // create new event
  $(document).on("click", "#SaveNewEventBtn", (event) => {
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

  // edit event - not implenented !!!
  $(document).on("click", "#editEventButton", (event) => {
    console.log("Inside edit event!");
    event.preventDefault();

    $("#eventEditModal").modal("show");
    cleanAddModalFields();

    // not implenented !!!
    // - get the event data - place in the right fields
    // - save updated
    // close 2 modals
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
