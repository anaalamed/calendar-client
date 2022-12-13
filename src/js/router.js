import { initLogin, initRegistration } from "./auth/auth";
import { update, copyLink, importFile, exportFile } from "./doc-functions";
import { newSharedUser, updatePermission, updatePermissionAndNotify } from "./share";
import { getChildren, initImport } from "./folder";

const redirect = (page) => {
  window.history.pushState({}, "", page);
  handleLocation();
};

const redirectToDoc = (page, docId) => {
  window.history.pushState({}, "", page);
  handleLocationWithDoc(docId);
};

const initRouter = () => {
  // create document click that watches the nav links only
  document.addEventListener("click", (e) => {
    const { target } = e;
    if (!target.matches("div a")) {
      e.preventDefault();
      return;
    }
    e.preventDefault();
    urlRoute();
  });
};

const urlPageTitle = "Shared Docs";

// create an object that maps the url to the template, title, and description
const urlRoutes = {
  404: {
    template: "pages/404.html",
    title: "404 | " + urlPageTitle,
    description: "Page not found",
  },
  "/": {
    template: "pages/home.html",
    title: "Home | " + urlPageTitle,
    description: "This is the home page",
  },
  "/signup": {
    template: "pages/signup.html",
    title: "Sign Up | " + urlPageTitle,
    description: "This is the sign up page",
    init: () => {
      initRegistration();
    },
  },
  "/login": {
    template: "pages/login.html",
    title: "Log In | " + urlPageTitle,
    description: "This is the log in page",
    init: () => {
      initLogin();
      // initRegistration();
    },
  },
  "/docs": {
    template: "pages/docs.html",
    title: "Docs | " + urlPageTitle,
    description: "This is the docs page",
    init: () => {
      exportFile();
      importFile();
      copyLink();
      update();
    },
  },
  "/folder": {
    template: "pages/folder.html",
    title: "Folder | " + urlPageTitle,
    description: "This is the folder page",
    init: () => {
      getChildren();
      initImport();
    },
  },
  "/share": {
    template: "pages/share.html",
    title: "Share | " + urlPageTitle,
    description: "This is the share page",
    init: () => {
      newSharedUser();
      updatePermission();
      updatePermissionAndNotify();
    },
  },
};

// create a function that watches the url and calls the urlLocationHandler
const urlRoute = async (event) => {
  console.log("urlRoute");
  event = event || window.event; // get window.event if event argument not provided
  event.preventDefault();
  // window.history.pushState(state, unused, target link);
  window.history.pushState({}, "", event.target.href);
  await urlLocationHandler();
};

// create a function that handles the url location
const urlLocationHandler = async () => {
  const location = window.location.pathname; // get the url path
  console.log(location);

  if (location.length == 0) {
    location = "/";
  }
  // get the route object from the urlRoutes object
  const route = urlRoutes[location] || urlRoutes["404"];
  // get the html from the template

  const html = await fetch(route.template).then((response) => response.text());
  // set the content of the content div to the html
  document.getElementById("content").innerHTML = html;

  if (route.init) route.init();
  // route.init();

  // set the title of the document to the title of the route
  document.title = route.title;
  // set the description of the document to the description of the route
  // document.querySelector('meta[name="description"]').setAttribute("content", route.description);
};

export { redirectToDoc, redirect, initRouter };
