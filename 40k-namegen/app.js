/*
**  Variables
*/

let namejson

/*
**  Initialize
*/

document.addEventListener("DOMContentLoaded", function() {
  let options_button = document.getElementById('options-button');
  options_button.addEventListener("click", function() {
    switchOptions();
  });
  $.ajax({
    url: "names.json",
    type: "GET",
    dataType: "json",
    success: function(data) {
      namejson = data;
      let keys = Object.keys(data);
      let container = document.getElementById('main-container');
      // Generate buttons
      for (i = 0; i < keys.length; i++) {
        let wrapper = document.createElement("div");
        wrapper.className = "gen-item";

        let head = document.createElement("div");
        head.innerHTML = "Module : " + namejson[keys[i]]["title"];
        head.className = "cattitle";

        wrapper.appendChild(head);
        genButton("Male", keys[i] + "$male", wrapper);
        genButton("Female", keys[i] + "$female", wrapper);
        container.appendChild(wrapper);
        if (i < keys.length - 1) {
          let br = document.createElement("hr");
          container.appendChild(br);
        }
      }
    }
  });
});

/*
**  Switch Options
*/

function switchOptions() {
  let button = document.getElementById('options-button');
  let options = document.getElementById('options');
  if (options.style.maxHeight) {
    options.style.maxHeight = null;
    button.innerHTML = "▼";
  } else {
    options.style.maxHeight = "100vh";
    button.innerHTML = "▲";
  }
}

/*
**  Create button
*/

function genButton(title, id, container) {
  let button = document.createElement("button");
  button.innerHTML = title;
  button.id = id;
  button.className = "btn";
  button.addEventListener("click", function() {
    nameGen(this.id);
  });
  container.appendChild(button);
}

/*
**  Randomize name
*/

function nameGen(nmod) {
  let result = document.getElementById("name_result");

  let cat = nmod.split('$')[0];
  let gender = nmod.split('$')[1];
  let sublist = namejson[cat];

  let plock = document.getElementById('plock');
  let prenom
  if (plock.checked) {
    prenom = result.innerHTML.split(' ')[0];
    console.log(prenom);
  } else {
    let plist = sublist["prenoms"][gender];
    let pseed = randInt(0, plist.length - 1);
    prenom = plist[pseed];
    let change = document.getElementById('plock-text');
    change.innerHTML = '\"' + prenom + '\"'
  }

  let nlock = document.getElementById('nlock');
  let nom
  if (nlock.checked) {
    nom = result.innerHTML.split(' ')[1];
  } else {
    let nlist = sublist["noms"];
    let nseed = randInt(0, nlist.length - 1);
    nom = nlist[nseed];
    let change = document.getElementById('nlock-text');
    change.innerHTML = '\"' + nom + '\"';
  }

  result.innerHTML = prenom + " " + nom;
}

/*
**  Get random int
*/

function randInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
