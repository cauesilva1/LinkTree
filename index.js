function changeBackground() {

  let body = document.getElementsByTagName("body")[0];
  let h2 = document.getElementById("h2");
  let footer = document.getElementById("footer");

  let isChecked = document.querySelector('.switch-container input').checked;
  if (isChecked) {
    h2.style.color = "#fff";
    footer.style.color = "#fff";
    body.style.backgroundImage = "url('./image/espaco.gif')";
  } else {
    h2.style.color = "#000000";
    footer.style.color = "#000000";
    body.style.backgroundImage = "url('./image/light.gif')";
    body.style.backgroundRepeat = "no-repeat";
    body.style.backgroundSize = "cover";
  }
}