import $ from "jquery";
import axios from "axios";
import { serverAddress } from "./constants";

const userEmailList = new Array();

// -------------------- new user -------------------------------
const newSharedUser = () => {
  $(".addUser").on("click", function () {
    console.log("add user");
    const inputUser = document.getElementById("input-user").value;
    var li = document.createElement("li");
    var user = document.createTextNode(inputUser);
    li.appendChild(user);
    userEmailList.push(inputUser);
    console.log(inputUser);
    console.log(userEmailList);
    document.getElementById("users-table").appendChild(li);
  });
};

const updatePermission = () => {
  $(document).on("click", "#btnUpdate", () => {
    console.log("on Update Permission user list: ");
    console.log(userEmailList);

    //update permission
    shareRequest(76, 74, userEmailList, permission, false); //TODO: change too ownerId, parentId
  });
};

const updatePermissionAndNotify = () => {
  $(document).on("click", "#btnUpdateAndNotify", () => {
    console.log("on updatePermissionAndNotify: user list: ");
    console.log(userEmailList);

    //update permission and notify
    let permission = document.getElementById("permission").value;
    console.log(permission);
    shareRequest(76, 74, ["tbz1996@gmail.com"], permission, false); //TODO: change too ownerId, parentId
  });
};

const shareRequest = async (
  documentID,
  ownerID,
  emails,
  permission,
  notify
) => {
  const res = await axios({
    method: "patch",
    url: serverAddress + "/document/share",
    headers: {
      token: "1669728413023-26563711-c6d1-487f-a04e-63631185afb3",
    },
    data: {
      documentID: documentID,
      ownerID: ownerID,
      emails: emails,
      permission: permission,
      notify: notify,
    },
  });
  console.log(res);
};

export { newSharedUser, updatePermission, updatePermissionAndNotify };
