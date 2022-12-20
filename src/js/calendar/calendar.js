import {getAllEventsByUser} from "../rest";

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
  
}

export { addEvent , initCalendar};
