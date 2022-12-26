import { serverAddress } from "./constants";
import { calendar } from "../js/calendar/fullCalendar";
import axios from "axios";
import $ from "jquery";

var currentUserEvents = [];

function time() {
  $("header .time").text(calcTime(sessionStorage.zoneDiff));
}
setInterval(time, 1000);

//calcTime
function calcTime(offset) {
  // create Date object for current location
  var d = new Date();

  // convert to msec
  // subtract local time zone offset
  // get UTC time in msec
  var utc = d.getTime() + d.getTimezoneOffset() * 60000;

  // create new Date object for different city
  // using supplied offset
  var nd = new Date(utc + 3600000 * offset);
  //ParseDateTime( nd.toLocaleString(), "yyyy-mm-ddThh:mm:ss");
  var nd2 = new Date(nd);
  nd2.setHours(nd.getHours());
  sessionStorage.setItem("currentTime", nd2.toJSON());

  // return time as a string
  return nd.toLocaleString();
}

// ------------------------ events ----------------------------------
// origin
// const getAllEventsByUser = (userId) => {
//   const FetchPromise = axios({
//     method: "GET",
//     url: serverAddress + "/event/getEventsByUserId",
//     headers: {
//       "Content-Type": "application/json",
//       token: sessionStorage.getItem("token"),
//     },
//     data: {},
//   });

//   FetchPromise.then((res) => {
//     console.log(res.data.data);
//     let myNewEvents = res.data.data;
//     for (let i = 0; i < res.data.data.length; i++) {
//       myNewEvents[i].start = myNewEvents[i].time;
//       myNewEvents[i].myDuration = myNewEvents[i].duration;
//       for (let j = 0; j < myNewEvents[i].roles.length; j++) {
//         if (myNewEvents[i].roles[j].roleType == "ORGANIZER" && myNewEvents[i].roles[j].user.id == sessionStorage.getItem("userId")) currentUserEvents.push(myNewEvents[i]);
//       }
//     }
//     console.log(currentUserEvents);
//     //calendar.addEventSource(myNewEvents);///////////
//   }).catch((error) => {
//     console.log(error);
//   });
// };

// delete event - not implemented
// cancel event for me  - not implemented
const getAllEventsByUser = (userId) => {
  const FetchPromise = axios({
    method: "GET",
    url: serverAddress + "/event/getEventsByUserId",
    headers: {
      "Content-Type": "application/json",
      token: sessionStorage.getItem("token"),
    },
    data: {},
  });
  var myNewEvents;
  FetchPromise.then((res) => {
    myNewEvents = res.data.data;

    for (let i = 0; i < res.data.data.length; i++) {
      //research of mostfa and leon DON'T TOUCH OR CHANGE IT
      //--------------------------------------------------------
      var updatedZone;
      var calcZone = sessionStorage.zone.split(":");

      var h = parseInt(calcZone[0] * -1 + parseInt("+04:00"));
      if (h < 0) {
        if (h > 10) {
          updatedZone = "-" + h + ":" + calcZone[1];
        } else {
          updatedZone = "-0" + h + ":" + calcZone[1];
        }
      } else {
        if (h > 10) {
          updatedZone = "+" + h + ":" + calcZone[1];
        } else {
          updatedZone = "+0" + h + ":" + calcZone[1];
        }
      }

      console.log(updatedZone);

      myNewEvents[i].start = myNewEvents[i].time.split("+")[0] + updatedZone;

      //--------------------------------------------------------

      myNewEvents[i].myDuration = myNewEvents[i].duration;
      var myHour = new Date(myNewEvents[i].start).getHours();
      var myMin = new Date(myNewEvents[i].start).getMinutes();
      var myDuration2 = myNewEvents[i].duration;
      var calEnd = new Date(myNewEvents[i].start).setHours(myHour + myDuration2, (myHour + myDuration2 - (myHour + parseInt(myDuration2))) * 60 + myMin);

      myNewEvents[i].end = calEnd;
      myNewEvents[i].resourceId = sessionStorage.getItem("userId");

      if (myNewEvents[i].resourceId == sessionStorage.getItem("userId")) {
        $(".fc-event").css("background-color", "#D7CDD5").addClass(sessionStorage.getItem("userId"));
      }
    }
    // var resource = [{id: sessionStorage.getItem("userId")}];
    // myNewEvents.source=resource;
    console.log("myNewEvents: " + myNewEvents);
    calendar.addEventSource(myNewEvents); ///////////

    //ADDED class equals to orginaizerid
    for (let i = 0; i < res.data.data.length; i++) {
      if (myNewEvents[i].resourceId == sessionStorage.getItem("userId")) {
        $(".fc-event").css("background-color", "#D7CDD5").addClass(sessionStorage.getItem("userId"));
        console.log(myNewEvents[i].resourceId);
      }
    }
  }).catch((error) => {
    console.log(error);
  });
};

const saveNewEvent = (event, addGuests) => {
  const FetchPromise = axios({
    method: "POST",
    url: serverAddress + "/event/saveEvent",
    headers: {
      "Content-Type": "application/json",
      token: sessionStorage.getItem("token"),
    },
    data: {
      title: event.title,
      time: event.time,
      duration: event.myDuration,
      location: event.location,
      description: event.description,
      attachments: event.attachments,
      public: event.public,
      user: [],
    },
  });

  FetchPromise.then(async (res) => {
    console.log(res.data.data);
    sessionStorage.setItem("currentEventId", res.data.data.id);
    for (let i = 0; i < addGuests.length; i++) {
      inviteGuest(addGuests[i]);
      await new Promise((r) => setTimeout(r, 2000));
    }

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

    // event.user.push(myGuest);
    location.reload();
  }).catch((error) => {
    console.log(error.response.data.message);
  });
};

const updateEvent = (event, addGuests) => {
  const update = axios({
    method: "PUT",
    url: serverAddress + "/event/updateEvent/event",
    headers: {
      "Content-Type": "application/json",
      token: sessionStorage.getItem("token"),
    },
    params: {
      eventId: sessionStorage.getItem("currentEventId"),
    },
    data: {
      title: event.title,
      time: event.time,
      duration: event.myDuration,
      location: event.location,
      description: event.description,
      attachments: event.attachments,
      public: event.public,
      user: [],
    },
  })
    .then(async (res) => {
      console.log(res.data.data);
      sessionStorage.setItem("currentEventId", res.data.data.id);
      for (let i = 0; i < addGuests.length; i++) {
        inviteGuest(addGuests[i]);
        await new Promise((r) => setTimeout(r, 2000));
      }
      // location.reload();
    })
    .catch((error) => {
      console.log(error.response.data.message);
    });
};

const deleteEvent = async (id) => {
  const deleteE = axios({
    method: "DELETE",
    url: serverAddress + "/event/deleteEvent?eventId=" + sessionStorage.getItem("currentEventId"),
    headers: {
      "Content-Type": "application/json",
      token: sessionStorage.getItem("token"),
    },
  })
    .then((res) => {
      console.log(res);
      return res;
    })
    .catch((error) => {
      console.log(error.response.data.message);
    });
  return await deleteE;
};

const hideEvent = async (id) => {
  const hide = axios({
    method: "PATCH",
    url: serverAddress + "/event/leaveEvent?eventId=" + sessionStorage.getItem("currentEventId"),
    headers: {
      "Content-Type": "application/json",
      token: sessionStorage.getItem("token"),
    },
  })
    .then((res) => {
      console.log(res);
      return res;
    })
    .catch((error) => {
      console.log(error.response.data.message);
    });
  return await hide;
};

const switchStatus = async (isArrive) => {
  const switchS = axios({
    method: "PATCH",
    url: serverAddress + "/event/switchStatus?eventId=" + sessionStorage.getItem("currentEventId"),
    headers: {
      "Content-Type": "application/json",
      token: sessionStorage.getItem("token"),
    },
    params: {
      booleanValue: isArrive,
    },
  })
    .then((res) => {
      console.log(res);
      return res;
    })
    .catch((error) => {
      console.log(error.response.data.message);
    });
  return await switchS;
};

// ------------------------ roles ----------------------------------
// switch role - not implemented!

const inviteGuest = async (email) => {
  const invite = axios({
    method: "POST",
    url: serverAddress + "/event/inviteGuest?eventId=" + sessionStorage.getItem("currentEventId") + "&email=" + email, // Will need to change to eventId later!!!!~~~~~~
    headers: {
      "Content-Type": "application/json",
      token: sessionStorage.getItem("token"),
    },
    data: {},
  })
    .then((res) => {
      // console.log(res);
      return res;
    })
    .catch((error) => {
      console.log(error.response.data.message);
    });
  return await invite;
};

const removeGuest = async (email) => {
  const remove = axios({
    method: "DELETE",
    url: serverAddress + "/event/removeGuest?eventId=" + sessionStorage.getItem("currentEventId") + "&email=" + email,
    headers: {
      "Content-Type": "application/json",
      token: sessionStorage.getItem("token"),
    },
    data: {},
  })
    .then((res) => {
      console.log(res.data.data);
      return true;
    })
    .catch((error) => {
      console.log(error.response.data.message);
      return false;
    });
  return await remove;
};

const switchRole = async (id) => {
  const switchR = axios({
    method: "PATCH",
    url: serverAddress + "/event/switchRole?eventId=" + sessionStorage.getItem("currentEventId"),
    headers: {
      "Content-Type": "application/json",
      token: sessionStorage.getItem("token"),
    },
    data: id,
  })
    .then((res) => {
      console.log(res);
      return res;
    })
    .catch((error) => {
      console.log(error.response.data.message);
    });
  return await switchR;
};

export { updateEvent, getAllEventsByUser, inviteGuest, saveNewEvent, removeGuest, switchRole, deleteEvent, hideEvent, switchStatus };
