function updateZone(city) {
  switch (city) {
    case "JERUSALEM":
      sessionStorage.setItem("zone", "+02:00");
      sessionStorage.setItem("zoneDiff", "+2");
      break;
    case "PARIS":
      sessionStorage.setItem("zone", "+01:00");
      sessionStorage.setItem("zoneDiff", "+1");
      break;
    case "LONDON":
      sessionStorage.setItem("zone", "+00:00");
      sessionStorage.setItem("zoneDiff", "+0");
      break;
    case "NEW_YORK":
      sessionStorage.setItem("zone", "-05:00");
      sessionStorage.setItem("zoneDiff", "-5");
      break;
    default:
      sessionStorage.setItem("zone", "+02:00");
      sessionStorage.setItem("zoneDiff", "+2");
  }
}

const renderUserinList = (user) => {
  console.log(user);
  let status = "";
  let statusClass = "";
  switch (user.statusType) {
    case "TENTATIVE":
      status = "?";
      statusClass = "tentative";
      break;
    case "APPROVED":
      status = "V";
      statusClass = "approved";
      break;
    case "REJECTED":
      status = "X";
      statusClass = "rejected";
      break;
    default:
    // code block
  }

  const userType = user.roleType.toLowerCase();
  const email = user.user.email;
  const id = user.user.id;

  const userToRender = `<li  id="${id}" class="userWrpper">
  <div class="${userType}Status ${statusClass}">${status}</div>
  <div class="${userType}Email">${email}</div>
  <div class="${userType}ChangeRole"><i class="bi bi-arrow-down-up"></i></div>
  <div class="${userType}Remove"><i class="bi bi-trash"></i></div>
  </li>`;

  if (userType == "admin") {
    $(".field.admins div.listWrapper ul").append(userToRender);
  } else if (userType == "guest") {
    $(".field.guests div.listWrapper ul").append(userToRender);
  }
};

const cleanAddModalFields = () => {
  $("#eventEditModal").modal("show"); // modal debug
  $("#organizerField").text(sessionStorage.getItem("currentUser"));
  $("#adminUsers").empty();
  $("#guestUsers").empty();
  $("#editModalTitle").val("");
  $("#date").val("");
  $("#time").val("");
  $("#checkbox").val("");
  $("#location").val("");
  $("#duration").val("");
  $("#description").val("");
};

export { updateZone, renderUserinList, cleanAddModalFields };
