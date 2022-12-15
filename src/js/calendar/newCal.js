const initNewCal = () => {
  var events = [];
  events[0] = [];
  events[0][0] = "Sunday";
  events[0][1] = "3:00pm";
  events[0][2] = "Just a sample event";
  events[0][3] = "#c0c0c0";
  //events[0][4] = "6:00pm"; <- optional end time
  events[1] = [];
  events[1][0] = "Monday";
  events[1][1] = "12:00pm";
  events[1][2] = "Another event";
  events[1][3] = "#8FD8D8";

  var weekday = new Array(7);
  weekday[0] = "Sun (Apr 13)";
  weekday[1] = "Mon (Apr 14)";
  weekday[2] = "Tue (Apr 15)";
  weekday[3] = "Wed (Apr 16)";
  weekday[4] = "Thu (Apr 17)";
  weekday[5] = "Fri (Apr 18)";
  weekday[6] = "Sat (Apr 19)";

  //   var prettyCal = new PrettyCalendar(events, "navWrap");
  var prettyCal = new PrettyCalendar(events, "navWrap", false, weekday);

  // new event array
  var newEvents = [];
  newEvents[0] = [];
  newEvents[0][0] = "Thursday";
  newEvents[0][1] = "1:00pm";
  newEvents[0][2] = "New event";
  newEvents[0][3] = "red";

  PrettyCalendar.updateEvents(newEvents);
};

export { initNewCal };
