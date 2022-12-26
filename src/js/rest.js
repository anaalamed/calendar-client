import { serverAddress } from "./constants";
import { calendar } from "../js/calendar/fullCalendar";
import { renderUserinList } from "../js/calendar/calendar";
import axios from "axios";
import $ from "jquery";

var currentUserEvents = [];

function time() {
  $("header .time").text(calcTime(sessionStorage.zoneDiff));
}
setInterval(time, 1000);

// ------------------------ auth ----------------------------------
const login = (user) => {
  const loginFetchPromise = axios({
    method: "post",
    url: serverAddress + "/auth/login",
    headers: {
      "Content-Type": "application/json",
    },
    data: {
      email: user.email,
      password: user.password,
    },
  });

  loginFetchPromise
    .then(async (res) => {
      $(".modal-title").text("Log In success");
      $(".modal-body").text("Log In successfull!");

      sessionStorage.setItem("userId", res.data.data.userId);
      sessionStorage.setItem("token", res.data.data.token);
      sessionStorage.setItem("currentUser", res.data.data.name);
      sessionStorage.setItem("city", res.data.data.city);
      $("header .me .name").text("Hi, " + sessionStorage.currentUser);
      $("header .city").text(sessionStorage.city);
      $("body").addClass("loggedin");

      updateZone(sessionStorage.city);

      await new Promise((r) => setTimeout(r, 2000));
      window.location.replace("http://localhost:9000/");
    })
    .catch((error) => {
      $(".modal-title").text("Log In failed");
      $(".modal-body").text(error.response.data.message);
    });
};

function updateZone(city) {
  switch (city) {
    case "JERUSALEM":
      sessionStorage.setItem("zone", "+02:00");
      sessionStorage.setItem("zoneDiff", "+2");
      break;
    case "PARIS":
      sessionStorage.setItem("zone", "+01:00");
      sessionStorage.setItem("zoneDiff", "+1");
      break;
    case "LONDON":
      sessionStorage.setItem("zone", "+00:00");
      sessionStorage.setItem("zoneDiff", "+0");
      break;
    case "NEW_YORK":
      sessionStorage.setItem("zone", "-05:00");
      sessionStorage.setItem("zoneDiff", "-5");
      break;
    default:
      sessionStorage.setItem("zone", "+02:00");
      sessionStorage.setItem("zoneDiff", "+2");
  }
}

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

const createUser = (user) => {
  const createUserFetchPromise = axios({
    method: "post",
    url: serverAddress + "/auth/signup",
    headers: {
      "Content-Type": "application/json",
    },
    data: {
      email: user.email,
      name: user.name,
      password: user.password,
    },
  });

  createUserFetchPromise
    .then((res) => {
      $(".modal-title").text("Registration success");
      $(".modal-body").text("Registration successfull!");

      $(document).on("click", "#signUpCloseBtn", function (event) {
        window.location.replace("http://localhost:9000/");
      });
    })
    .catch((error) => {
      $(".modal-title").text("Registration failed");
      $(".modal-body").text(error.response.data.message);
    });
};

const loginGithub = (code) => {
  const loginGithubFetchPromise = axios({
    method: "post",
    url: serverAddress + "/auth/loginGithub",
    headers: {
      "Content-Type": "application/json",
    },
    params: {
      code: code,
    },
  })
    .then((res) => {
      sessionStorage.setItem("userId", res.data.data.userId);
      sessionStorage.setItem("token", res.data.data.token);
      sessionStorage.setItem("currentUser", res.data.data.name);
      $("header .me .name").text("Hi, " + res.data.data.name);

      window.history.pushState({}, document.title, "/");
      console.log("booom");

      // $("#modalResponse").modal("show");
      // $(".modal-title").text("Log In success");
      // $(".modal-body").text("Log In with Github successfull!");
    })
    .catch((error) => {
      $(".modal-title").text("Log In failed");
      $(".modal-body").text("Log In with Github failed");
    });
  loginGithubFetchPromise();
};

// ------------------------ settings ----------------------------------
// right implementation!
const getSettings = async (city) => {
  const getMySettings = axios({
    method: "GET",
    url: serverAddress + "/user/getNotificationSettings",
    headers: {
      "Content-Type": "application/json",
      token: sessionStorage.getItem("token"),
    },
  })
    .then((res) => {
      // console.log(res.data);
      return res;
    })
    .catch((error) => {
      console.log(error);
    });
  return await getMySettings;
};

const updateCity = (city) => {
  const updateLocation = axios({
    method: "PATCH",
    url: serverAddress + "/user/updateCity",
    headers: {
      "Content-Type": "application/json",
      token: sessionStorage.getItem("token"),
    },
    params: {
      newCity: city,
    },
  })
    .then((res) => {
      const city = res.data.data.city;
      sessionStorage.setItem("city", city);
      $("header .city").text(city);

      $("#modalResponse .modal-title").text("City update");
      $("#modalResponse .modal-body").text("City was updated successfull!");
      updateZone(city);
      // $("#modalResponse").modal("show");
    })
    .catch((error) => {
      $(".modal-title").text("City update");
      $(".modal-body").text("City update failed!");
    });
  // updateLocation();
};

const updateNotificationsSettings = (settings) => {
  console.log("updateNotificationsSettings");
  const updateNotifications = axios({
    method: "PUT",
    url: serverAddress + "/user/update",
    headers: {
      "Content-Type": "application/json",
      token: sessionStorage.getItem("token"),
    },
    params: {
      notifications: "",
    },
    data: settings,
  })
    .then((res) => {
      $("#modalResponse .modal-title").text("Notification Settings update");
      $("#modalResponse .modal-body").text("Notification Settings were update");
      // $("#modalResponse").modal("show");
    })
    .catch((error) => {
      $(".modal-title").text("Notification Settings update");
      $(".modal-body").text("Notification Settings update failed!!!");
    });
  // updateNotifications();
};

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
  const FetchPromise = axios({
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
  });

  FetchPromise.then(async (res) => {
    console.log(res.data.data);
    sessionStorage.setItem("currentEventId", res.data.data.id);
    for (let i = 0; i < addGuests.length; i++) {
      inviteGuest(addGuests[i]);
      await new Promise((r) => setTimeout(r, 2000));
    }

    // add to fullCalendar
    // calendar.addEvent({
    //   title: $("#editModalTitle").val(),
    //   start: $("#date").val() + "T" + $("#time").val(),
    //   end: "2022-12-19T20:00:00",
    //   extendedProps: {
    //     public: $("#checkbox").is(":checked"),
    //     location: $("#location").val(),
    //     organizer: sessionStorage.getItem("currentUser"),
    //     duration: $("#duration").val(),
    //   },
    //   description: $("#description").val(),
    // });

    // event.user.push(myGuest);
    location.reload();
  }).catch((error) => {
    console.log(error.response.data.message);
  });
};

// ------------------------ roles ----------------------------------
// switch role - not implemented!

const switchRole = async (id) => {
  const switchR = axios({
    method: "PATCH",
    url: serverAddress + "/event/switchRole?eventId=" + sessionStorage.getItem("currentEventId"), // Will need to change to eventId later!!!!~~~~~~
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

export { updateEvent, createUser, login, loginGithub, getAllEventsByUser, inviteGuest, saveNewEvent, removeGuest, updateCity, updateNotificationsSettings, getSettings, switchRole };
