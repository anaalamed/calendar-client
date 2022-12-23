import { getAllEventsByUser, inviteGuest, saveNewEvent, removeGuest } from "../rest";
import { calendar } from "./fullCalendar";

var addGuests = [];

const addEvent = (calendar) => {
  // calendar.addEvent( event [, source ] )
};

const initCalendar = () => {
  $(document).on("click", "#getAllEventsBtn", (event) => {
    event.preventDefault();
    getAllEventsByUser(sessionStorage.getItem("userId"));
  });

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

  $(document).on("click", "#SaveNewEventBtn", (event) => {
    console.log("Inside add new event!");
    event.preventDefault();
///////////////////////////////////////
    const eventToAdd = {
      title: $(".title").val(),
      time: $("#date").val() + "T" + $("#time").val(),
      date: $("#date").val(),
      myDuration: $("#duration").val(),
      location: $("#location").val(),
      description: $("#description").val(),
      organizer: sessionStorage.getItem("currentUser"),
      public: $("#checkbox").is(":checked")
    };
    
    saveNewEvent(eventToAdd,addGuests);
  });







  $(document).on("click", ".guestRemove", (event) => {
    console.log("Inside Remove Guest From Event!");
    event.preventDefault();

    const email = $("#guestEmail").val()

    console.log(sessionStorage.getItem("userId"));
    removeGuest(email);
  });

  // request is not implemented for: (modal add event)
  // - change role,
};

export { addEvent, initCalendar };
