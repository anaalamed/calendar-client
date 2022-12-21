import { getAllEventsByUser } from "../rest";

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

  // request is not implemented !
  $(document).on("click", "#eventAddGuest", (event) => {
    console.log("Inside add guest to event (event modal)");
    event.preventDefault();

    console.log($(".row.addGuest input").val());
    $(".field.guests .listWrapper ul").append(`<li class="userWrpper">
      <div class="questStatus">status</div>
      <div class="questEmail">${$(".row.addGuest input").val()}</div>
      <div class="guestChangeRole">role</div>
      <div class="guestRemove">X</div>
    </li>`);

    $(".row.addGuest input").val("");
  });

  // request is not implemented for: (modal add event)
  // - add event
  // - change role,
  // - remove user
};

export { addEvent, initCalendar };
