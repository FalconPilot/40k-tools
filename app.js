/*
**  Button
*/

document.addEventListener("DOMContentReady", function() {
  let button = document.getElementById('namegen');
  button.addEventListener("click", function() {
    nameGen("name_result");
  });
});

function nameGen(id) {
  let elem = document.getElementById(id);
}
