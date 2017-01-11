window.onload = function() {
  var home_logo = document.getElementById("home_logo");
  var home_text = document.getElementById("home_text");
  main(home_logo, home_text);
}

window.onresize = function() {
  var home_logo = document.getElementById("home_logo");
  var home_text = document.getElementById("home_text");
  main(home_logo, home_text);
}

function main(home_logo, home_text) {
  home_logo.style.marginLeft = (window.innerWidth / 2 - home_logo.width) + "px";

  home_text.style.marginRight = (window.innerWidth / 2 - home_text.width) + "px";
}
