import { serverAddress } from "./constants";
import axios from "axios";
import $ from "jquery";

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
      "token": sessionStorage.getItem("token")
    },
    data: {
    },
  });

  FetchPromise
    .then((res) => {
      console.log(res.data.data)
    })
    .catch((error) => {
      console.log(error.response.data.message)
    });
};

export { createUser, login , getAllEventsByUser};
