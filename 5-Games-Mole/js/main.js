"use strict";
let gameStart = false;
let nowMole = -1;
let time = 0;
let score = 0;

function $(id) {
  return document.getElementById(id);
}

for (let i = 0; i < 60; i++) {
  let node = document.createElement('input');
  node.type = 'radio';
  node.value = i;
  node.className = 'mole'
  $('moles').appendChild(node);
}

Array.from(document.getElementsByClassName('mole'), radio => {
  radio.checked = false;
  radio.onclick = function(e) {
    e.target.checked = false;
    if (gameStart) hitMole(e.target.value);
  };
});

$('startBtn').onclick = function(e) {
  gameStart = !gameStart;
  if (!gameStart) {
    gameOver();
  } else {
    $('stateText').value = 'Playing';
    time = 30;
    score = 0;
    makeMole();
    update();
    setTimeout(setTime, 1000);
  }
}

function update() {
  $('time').value = time;
  $('score').value = score;
}

function makeMole() {
  let id = Math.ceil(Math.random() * 60 - 1);
  while (id === nowMole) {
    id = Math.ceil(Math.random() * 60 - 1);
  }
  nowMole = id;
  let radios = document.getElementsByClassName('mole');
  radios[id].checked = true;
}

function hitMole(i) {
  if (i == nowMole) {
    score++;
    makeMole();
  } else {
    score--;
    if (score < 0) {
      score = 0;
      gameOver();
      return;
    }
  }
  update();
}

function gameOver() {
  $('stateText').value = 'Game Over';
  gameStart = false;
  nowMole = -1;
  Array.from(document.getElementsByClassName('mole'), e => {
    e.checked = false;
  });
  alert('Game Over!\nYour score is ' + score);
}

function setTime() {
  if (!gameStart) return;
  if (time > 0) {
    time--;
    update();
    setTimeout(setTime, 1000);
  } else {
    gameOver();
  }
}
