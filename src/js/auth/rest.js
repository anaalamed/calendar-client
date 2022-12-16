import { serverAddress } from "../constants";
import axios from "axios";
import $ from "jquery";

const login = async (email, password) => {
  console.log("im logging in");
  const request = await axios({
    method: "post",
    url: serverAddress + "/auth/login",
    headers: {
      "Content-Type": "application/json",
    },
    data: {
      email: email,
      password: password,
    },
  })
    .then((res) => {
      console.log(res);
      $(".modal-title").text("Log In success");
      $(".modal-body").text("You can now use the app");
    })
    .catch((error) => {
      console.log(error);
      $(".modal-title").text("Log In failed");
      $(".modal-body").text("Please try again later");
    });

  console.log(request);
};

const createUser = async ({ email, name, password }) => {
  console.log("im signup");
  const request = await axios({
    method: "post",
    url: serverAddress + "/auth/signup",
    headers: {
      "Content-Type": "application/json",
    },
    data: {
      email: email,
      name: name,
      password: password,
    },
  })
    .then((res) => {
      console.log(res);
      $(".modal-title").text("Registration success");
      $(".modal-body").text("Please check your email and confirm your registration!");
    })
    .catch((error) => {
      console.log(error);
      $(".modal-title").text("Registration failed");
      $(".modal-body").text("Please try again later");
    });

  console.log(request);
};

export { createUser, login };
