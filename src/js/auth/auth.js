import $ from "jquery";
import { createUser, login } from "./rest";
import { redirectToGoogle } from "./google";

const initRegistration = () => {
  console.log("init registration ");
  // -------------------- registration -------------------------------
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
    login(email, password);
  });
};

const initGoogle = async () => {
  console.log("initGoogle");

  redirectToGoogle();
};

export { initLogin, initRegistration, initGoogle };
