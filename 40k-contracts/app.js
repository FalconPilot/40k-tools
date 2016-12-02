/*
**  Instance variables
*/

let player;
let contract;

/*
**  Initialize
*/

document.addEventListener("DOMContentLoaded", function() {
  let list = document.getElementsByTagName("input");
  for (i = 0; i < list.length; i++) {
    // Add oninput event
    list[i].value = "1";
    list[i].addEventListener("input", function() {
      let max = parseInt(this.id.split('$')[1]);
      if (this.value.length > 0) {
        let val = this.value.slice(-1)[0];
        let total = parseInt(this.value);
        if (isNaN(parseInt(val))) {
          this.value = this.value.slice(0, -1);
        } else if (total > max) {
          this.value = max;
        }
        if (parseInt(this.value) == 0) {
          this.value = "1";
        }
      }
      evaluate();
    });
  }
  // Execute Button
  let button = document.getElementById('exe-btn');
  button.addEventListener("click", function() {
    execute();
  });
  evaluate();
});

/*
**  Update player value
*/

function updatePlayer() {
  player = {
    cc:   getValue('cc$100'),
    ct:   getValue('ct$100'),
    agi:  getValue('agi$100'),
    soc:  getValue('soc$100')
  };
}

/*
**  Update contract value
*/

function updateContract() {
  contract = {
    difficulty: getValue('difficulty$100'),
    fdiff:      getValue('difficulty$100') + Math.floor((player.cc + player.ct) / 10),
    risk:       getValue('risk$100'),
    frisk:      getValue('risk$100') + Math.floor((player.agi + player.soc) / 10),
    duration:   getValue('duration$30')
  };
  let base = 800 - (contract.difficulty * 8);
  let multiplier = 5.0 / (contract.risk / 10.0);
  contract.value = Math.floor((base * (1 + (contract.duration * 0.1))) * multiplier);
}

/*
**  Evaluate contract
*/

function evaluate() {
  updatePlayer();
  updateContract();

  let cvalue = document.getElementById('cvalue');
  cvalue.innerHTML = toMoney(contract.value);

  let dvalue = document.getElementById('dvalue');
  dvalue.innerHTML = contract.fdiff;

  let rvalue = document.getElementById('rvalue');
  rvalue.innerHTML = contract.frisk;
}

/*
**  Execute contract
*/

function execute() {
  evaluate();
  fillResults("result", contract.fdiff);
  fillResults("risk", contract.frisk);
}

/*
**  Fill standard results
*/

function fillResults(key, value) {
  // Define containers
  let container = document.getElementById(key);
  let roll = document.getElementById(key + "_roll");
  let notif = document.getElementById(key + "_notif");
  let pop = document.getElementById(key + '_degrees');

  // Caculate score
  let score = randInt(1, 100);
  for (i = 1; i < contract.duration; i++) {
    let modseed = randInt(1, 100);
    if (modseed < value) {
      score -= 1;
    } else {
      score += 1;
    }
  }

  // Caculate degrees
  let degrees = value - score;
  if (degrees < 0) {
    degrees = Math.ceil(degrees / 10);
  } else {
    degrees = Math.floor(degrees / 10);
  }

  // Display results
  if (!notif.style.display) {
    notif.style.display = "block";
  }
  if (score <= value) {
    container.innerHTML = "Success !";
    notif.className = "success";
    pop.className = "degrees success";
  } else {
    container.innerHTML = "Fail !"
    notif.className = "failed";
    pop.className = "degrees fail";
  }
  pop.innerHTML = degrees;
  roll.innerHTML = score + "/" + value;
}

/*
**  Get element value
*/

function getValue(id) {
  return parseInt(document.getElementById(id).value) || 1;
}

/*
**  Generate random int
*/

function randInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

/*
**  Convert to money
*/

function toMoney(val) {
  return val.toFixed(2)
    .replace(/(\d)(?=(\d{3})+\.)/g, '$1\.')
    .slice(0, -3) + " T";
}
