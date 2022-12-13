import $ from "jquery";
import { serverAddress } from "./constants";
import { redirect, redirectToDoc } from "./router";

let currentDirId = 1;
let currentUserId = 2; //TODO: change later
const ull = $("#ull");
const list = document.createDocumentFragment();

const getChildren = (id) => {
  console.log("GETTING CHILDREN OF INODE" + id);
  fetch(serverAddress + "/fs/level", {
    method: "POST",
    body: JSON.stringify({
      id: id,
    }),
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((response) => {
      console.log(response);
      return response.json();
    })
    .then((data) => {
      let inodes = data;
      console.log(inodes);
      if (inodes.length == 0) {
        $("#ull").empty();
        $("#emptyMessage").text("This folder is empty");
      }
      inodes.map(function (inode) {
        let li = document.createElement("li");
        li.setAttribute("id", `${inode.id}`);
        li.setAttribute("type", `${inode.type}`);
        li.setAttribute("name", `${inode.name}`);
        li.onclick = function () {
          console.log("inode clicked " + li.getAttribute("id") + " type: " + li.getAttribute("class"));

          if (li.getAttribute("type") == "DIR") {
            $("#ull").empty();
            $("#path").append(li.getAttribute("name") + "/");
            getChildren(li.getAttribute("id"));
            currentDirId = li.getAttribute("id");
            //console.log("Current dir id changed:" + currentDirId);
          } else {
            redirectToDoc("/editing_doc", li.getAttribute("id"));
          }
        };

        let name = document.createElement("span");
        //let type = document.createElement("span");
        let icon = document.createElement("i");
        icon.className = li.getAttribute("type") == "DIR" ? "bi bi-folder" : "bi bi-file-earmark";

        name.innerHTML = `${inode.name}`;
        //type.innerHTML = `${inode.type}`;

        li.appendChild(icon);
        li.appendChild(name);
        //li.appendChild(type);
        list.appendChild(li);
      });
    })
    .catch((error) => {
      console.error(`ERROR: ${error}`);
    });
  $("#ull").append(list);
};

const initImport = () => {
  $("#importBtn").on("click", function (event) {
    event.preventDefault();
    const formData = new FormData();
    const fileField = document.querySelector('input[type="file"]');
    formData.append("ownerId", currentUserId);
    formData.append("path", fileField.files[0]);
    formData.append("parentId", currentDirId);
    console.log(formData);
    uploadFile(formData);
  });
};

const uploadFile = (formData) => {
  console.log("REST-UPLOAD FILE");
  fetch(serverAddress + "/document/import", {
    method: "POST",
    body: formData,
  })
    .then((response) => response.json())
    .then((result) => {
      console.log("Success", result);
    })
    .catch((error) => {
      console.error(`ERROR: ${error}`);
    });
};

export { getChildren, initImport };
