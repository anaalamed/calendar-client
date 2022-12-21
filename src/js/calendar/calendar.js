import { getAllEventsByUser, inviteGuest, saveNewEvent,removeGuest } from "../rest";

const addEvent = (calendar) => {
  // calendar.addEvent( event [, source ] )
};

const initCalendar = () => {
  $(document).on("click", "#getAllEventsBtn", (event) => {
    console.log("Inside Get All Events By User Id!");
    event.preventDefault();

    console.log(sessionStorage.getItem("userId"));
    getAllEventsByUser(sessionStorage.getItem("userId"));
  });

  $(document).on("click", "#eventAddGuest", (event) => {
    console.log("Inside add guest to event (event modal)");
    event.preventDefault();
    const email = $(".row.addGuest input");

    console.log($(".row.addGuest input").val());
    $(".field.guests .listWrapper ul").append(`<li class="userWrpper">
      <div class="questStatus">status</div>
      <div class="questEmail">${email.val()}</div>
      <div class="guestChangeRole">role</div>
      <div class="guestRemove">X</div>
    </li>`);

    inviteGuest(email.val());

    email.val("");
  });

  $(document).on("click", "#SaveNewEventBtn", (event) => {
    console.log("Inside add new event!");
    event.preventDefault();

    const eventToAdd = {
      title:  $(".title").val(),
      time: $("#time").val(),
      date: $("#date").val() ,
      duration: $("#duration").val(),
      location: $("#location").val(),
      description: $("#description").val(),
      public: $("#checkbox").is(":checked")
    };
  
    console.log(sessionStorage.getItem("userId"));
    saveNewEvent(eventToAdd);
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
