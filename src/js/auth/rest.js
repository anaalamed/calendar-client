import axios from "axios";
import $ from "jquery";
import { serverAddress } from "../constants";
import { updateZone } from "../utils";

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

export { createUser, login, loginGithub };
