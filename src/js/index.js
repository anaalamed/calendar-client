import $ from "jquery";
import { initRouter } from "./router";
import { openConnection } from "./sockets";
import "bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import "../styles/_custom.scss";

$(() => {
  initRouter();
  openConnection();

  $(document).ready(function () {
    if (sessionStorage.length > 0) {
      $("header .me .name").text("Hi, " + sessionStorage.currentUser);
      $("header .city").text(sessionStorage.city);
      $("body").addClass("loggedin");
    }
  });
});

// // insert dynamic html at different html files
// $(function () {
//   var includes = $("[data-include]");
//   $.each(includes, function () {
//     // var file = "views/" + $(this).data("include") + ".html";
//     var file = "blocks/" + $(this).data("include") + ".html";
//     console.log(file);

//     $(this).load(file);
//   });
// });

// // see password
// const pwShowHide = document.querySelectorAll(".eye-icon");
// pwShowHide.forEach((eyeIcon) => {
//   eyeIcon.addEventListener("click", () => {
//     let pwFields = eyeIcon.parentElement.parentElement.querySelectorAll('input[type="password"]');
//     pwFields.forEach((password) => {
//       if (password.type === "password") {
//         password.type = "text";
//         eyeIcon.classList.replace("bx-hide", "bx-show");
//         return;
//       }
//       password.type = "password";
//       eyeIcon.classList.replace("bx-show", "bx-hide");
//     });
//   });
// });
