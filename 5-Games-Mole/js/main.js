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

for (let radio of document.getElementsByClassName('mole')) {
  radio.onclick = function(e) {
    e.target.checked = false;
    if (gameStart) hitMole(e.target.value);
  }
}

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

function clearAll() {
  for (let radio of document.getElementsByClassName('mole')) {
    radio.checked = false;
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
  console.log(id);
}

function hitMole(i) {
  if (i == nowMole) {
    score++;
    makeMole();
  } else {
    score--;
    if (score < 0) {
      gameOver();
      return;
    }
  }
  update();
}

function gameOver() {
  $('stateText').value = 'Game Over';
  gameStart = false;
  clearAll();
  nowMole = -1;
  alert('Game Over!\nYour score is' + score);
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
