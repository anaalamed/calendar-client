import { serverAddress } from "../constants";
import axios from "axios";
import $ from "jquery";

// const createUser_ana = (user) => {
//   fetch(serverAddress + "/auth/signup", {
//     method: "POST",
//     body: JSON.stringify({
//       name: user.name,
//       email: user.email,
//       password: user.password,
//     }),
//     headers: {
//       "Content-Type": "application/json",
//     },
//   })
//     .then(async (response) => {
//       const isJson = response.headers
//         .get("content-type")
//         ?.includes("application/json");
//       const data = isJson && (await response.json());
//       // console.log(data);
//       const error = (data && data.message) || response.status;

//       if (!data.success) {
//         $(".modal-title").text("Registration failed");
//         $(".modal-body").text("Please try again later");
//         return Promise.reject(error);
//       }

//       $(".modal-title").text("Registration success");
//       $(".modal-body").text(
//         "Please check your email and confirm your registration!"
//       );
//     })
//     .catch((error) => {
//       console.error("error: ", error);
//     });
// };

// const loginUser = (user) => {
//   console.log("----- in loginUser() -----");
//   console.log(user);

//   fetch(serverAddress + "/auth/login", {
//     method: "POST",
//     body: JSON.stringify({ email: user.email, password: user.password }),
//     headers: {
//       "Content-Type": "application/json",
//     },
//   })
//     .then(async (response) => {
//       console.log(response);
//       const isJson = response.headers
//         .get("content-type")
//         ?.includes("application/json");
//       const data = isJson && (await response.json());
//       console.log(data);
//       const error = (data && data.message) || response.status;

//       if (!data.success) {
//         $(".modal-title").text("Log In failed");
//         $(".modal-body").text(error);
//         return Promise.reject(error);
//       }

//       $(".modal-title").text("Log In success");
//       $(".modal-body").text("You can now use the app");
//     })
//     .catch((error) => {
//       console.error("error: ", error);
//     });
// };

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
