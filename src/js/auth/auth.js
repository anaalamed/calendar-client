import $ from "jquery";
import { createUser, login, loginGithub } from "./rest";

const initRegistration = () => {
  console.log("init registration ");
  // -------------------- registration -------------------------------

  $(document)
    .off("click")
    .on("click", "#btnSignup", function () {
      // remove previous eventHandker
    });

  $(document).on("click", "#btnSignup", (event) => {
    console.log("registration");
    event.preventDefault();

    const user = {
      email: $(".form-floating #email").val(),
      name: $(".form-floating #name").val(),
      password: $(".form-floating #password").val(),
    };

    console.log(user);
    createUser(user);
  });
};

const initLogin = () => {
  console.log("init login");
  // -------------------- login -------------------------------

  $(document)
    .off("click")
    .on("click", "#btnLogin", function () {
      // remove previous eventHandker
    });

  $(document).on("click", "#btnLogin", function (event) {
    console.log("login");
    event.preventDefault();

    const user = {
      email: $(".form-floating #email").val(),
      password: $(".form-floating #password").val(),
    };
    const email = $(".form-floating #email").val();
    const password = $(".form-floating #password").val();

    console.log(user);
    login(user);
  });

  $(document).on("click", "#loginCloseBtn", function (event) {
    //window.location.replace("http://localhost:9000/calendar");
  });
};

const initGithub = async () => {
  console.log("initGithub");

  const location = window.location.href;

  if (location.includes("code")) {
    location.replace("/?", "/");
    console.log(location);
    var url = new URL(location);
    const code = url.searchParams.get("code");
    console.log(code);

    loginGithub(code);
  }

  // take a code from url and ro req to auth/loginGithub?code=...
};

export { initLogin, initRegistration, initGithub };
