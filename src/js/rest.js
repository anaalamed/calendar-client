import { serverAddress } from "./constants";
import { calendar } from "../js/calendar/fullCalendar";
import axios from "axios";
import $ from "jquery";

var currentUserEvents = [];
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
    .then((res) => {
      $(".modal-title").text("Log In success");
      $(".modal-body").text("Log In successfull!");


      sessionStorage.setItem("userId", res.data.data.userId);
      sessionStorage.setItem("token", res.data.data.token);
    })
    .catch((error) => {
      $(".modal-title").text("Log In failed");
      $(".modal-body").text(error.response.data.message);
    });

  const loginGetName = axios({
    method: "GET",
    url: serverAddress + "/user",
    headers: {
      "Content-Type": "application/json",
    },
    params: {
      email: user.email
    },
  });
  loginGetName.then((res) => {
    console.log(res.data.data.name);
    sessionStorage.setItem("currentUser", res.data.data.name);
  })


};

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

  FetchPromise.then((res) => {
    console.log(res.data.data);
    let myNewEvents = res.data.data;
    for (let i = 0; i < res.data.data.length; i++) {
      myNewEvents[i].start = myNewEvents[i].time;
      myNewEvents[i].myDuration = myNewEvents[i].duration;
      for (let j = 0; j < myNewEvents[i].roles.length; j++) {
        if (myNewEvents[i].roles[j].roleType == 'ORGANIZER' && myNewEvents[i].roles[j].user.id == sessionStorage.getItem("userId"))
          currentUserEvents.push(myNewEvents[i]);
      }
    }
    console.log(currentUserEvents);
    //calendar.addEventSource(myNewEvents);///////////
  }).catch((error) => {
    console.log(error);
  });
};

const inviteGuest = (email) => {
  const FetchPromise = axios({
    method: "POST",
    url: serverAddress + "/event/inviteGuest?eventId=" + sessionStorage.getItem("currentEventId") + "&email=" + email, // Will need to change to eventId later!!!!~~~~~~
    headers: {
      "Content-Type": "application/json",
      token: sessionStorage.getItem("token"),
    },
    data: {},
  });

  FetchPromise.then((res) => {
    console.log(res.data.data);
    return res.data.data;
  }).catch((error) => {
    console.log(error.response.data.message);
  });
};

const removeGuest = (email) => {
  const FetchPromise = axios({
    method: "DELETE",
    url: serverAddress + "/event/removeGuest?eventId=" + sessionStorage.getItem("currentEventId") + "&email=" + "leon@organizer.com", // Will need to change to eventId & email later!!!!~~~~~~
    headers: {
      "Content-Type": "application/json",
      token: sessionStorage.getItem("token"),
    },
    data: {},
  });

  FetchPromise.then((res) => {
    console.log(res.data.data);
  }).catch((error) => {
    console.log(error.response.data.message);
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
      date: event.date,
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
      await new Promise(r => setTimeout(r, 2000));
    }

    // event.user.push(myGuest);
    location.reload();
  }).catch((error) => {
    console.log(error.response.data.message);
  });
};
















export { createUser, login, getAllEventsByUser, inviteGuest, saveNewEvent, removeGuest };
