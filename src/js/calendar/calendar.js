import {getAllRolesByUserId} from "../rest";

const addEvent = (calendar) => {
  // calendar.addEvent( event [, source ] )
};

const initCalendar = () => {

  $(document).on("click", "#getAllRolesBtn", (event) => {

    console.log("Inside Get All Roles By User Id!");
    event.preventDefault();

    console.log(sessionStorage.getItem("userId"));
    getAllRolesByUserId(sessionStorage.getItem("userId"));
  });
  
}

export { addEvent , initCalendar};
