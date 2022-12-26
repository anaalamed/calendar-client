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

export { updateZone };
