window.onload = function() {
  var home_logo = document.getElementById("home_logo");
  var home_text = document.getElementById("home_text");
  main(home_logo, home_text);
  populateSchedule();
  populateDayOfContacts();
}

window.onresize = function() {
  var home_logo = document.getElementById("home_logo");
  var home_text = document.getElementById("home_text");
  main(home_logo, home_text);
}

function main(home_logo, home_text) {
  var centerMargin = window.innerWidth / 2 - home_logo.width;
  home_logo.style.marginLeft = centerMargin + "px";
  home_text.style.marginRight = centerMargin + "px";
}

Array.prototype.groupBy = function(key) {
  return this.reduce(function(rv, x) {
    (rv[x[key]] = rv[x[key]] || []).push(x);
    return rv;
  }, {});
};

Date.prototype.prettyTime = function() {
  return this.toLocaleTimeString().replace(/:\d+ /, ' ')
}

function populateSchedule() {
  $.getJSON("https://hack-cwru.com/api/v1/events", function(json) {
    var schedule = $("#schedule");
    var events = json.events;
    var utcShift = "-04:00";

    var daysOfWeek = [
      "Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"
    ]

    events.forEach(function (event) {
      event.startDate = new Date(event.startTime.replace(' ', 'T') + utcShift);
      event.endDate = new Date(event.endTime.replace(' ', 'T') + utcShift);
    });

    events.forEach(function (event) {
      event.dayOfWeek = daysOfWeek[event.endDate.getDay()];
      event.hash = event.endDate.toLocaleDateString().replace(/\//g, '-');
    })

    var groupedEvents = events.groupBy('hash');

    for (hash in groupedEvents) {
      var events = groupedEvents[hash];

      schedule.append("<h4>" + events[0].dayOfWeek + "</h4>")
      schedule.append("<ul id=events_" + events[0].hash + "></ul>");

      events.sort(function (lhs, rhs) {
        return lhs.startTime < rhs.startTime ? -1 : 1;
      });

      events.forEach(function (event) {
        var eventTime = "<i>" + event.startDate.prettyTime() + "</i> ";
        var eventDesc = "<b>" + eventTime + event.name + "</b>: " + event.description;
        var eventListItem = "<li>" + eventDesc + "</li>";
        $('#events_' + event.hash).append(eventListItem);
      });
    }
  });
}

function populateDayOfContacts() {
  $.getJSON("https://hack-cwru.com/api/v1/emergency/contacts/available", function(json) {
    var contactsDiv = $("#contacts");
    var emergencyContacts = json.emergencyContacts;

    if (emergencyContacts.length == 0) {
      return;
    }

    contactsDiv.append("<p>Organizers & other day of contacts</p>");
    contactsDiv.append("<ul id=emergency_contacts_list></ul>");

    var emergencyContactsList = $("#emergency_contacts_list");

    emergencyContacts.forEach(function(emergencyContact) {
      console.log(emergencyContact);
      var contactInfo = emergencyContact.name + " - "  + emergencyContact.phone;
      emergencyContactsList.append("<li>" + contactInfo + "</li>");
    });
  });
}
