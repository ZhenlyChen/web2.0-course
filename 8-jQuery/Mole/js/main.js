"use strict";

function $(id) {
  return document.getElementById(id);
}

function moleCtrl() {
  let score = 0;
  let time = 0;
  let gameStart = false;
  let nowMole = -1;
  let update = () => {
    $('score').value = score;
    $('time').value = time;
  };
  let makeMole = () => {
    let id = Math.ceil(Math.random() * 60 - 1);
    while (id === nowMole) {
      id = Math.ceil(Math.random() * 60 - 1);
    }
    nowMole = id;
    let radios = document.getElementsByClassName('mole');
    radios[id].checked = true;
  };
  let gameOver = () => {
    $('stateText').value = 'Game Over';
    gameStart = false;
    nowMole = -1;
    Array.from(document.getElementsByClassName('mole'), e => {
      e.checked = false;
    });
    alert('Game Over!\nYour score is ' + score);
  };
  let setTime = () => {
    if (!gameStart) return;
    if (time > 0) {
      time--;
      $('time').value = time;
      setTimeout(setTime, 1000);
    } else {
      gameOver();
    }
  };
  let control = {
    hit: (i) => {
      if (!gameStart) return;
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
    },
    start: () => {
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
  }
  return control;
}

(function() {
  let Mole = moleCtrl();
  let frag = document.createDocumentFragment();
  for (let i = 0; i < 60; i++) {
    let node = document.createElement('input');
    node.type = 'radio';
    node.value = i;
    node.className = 'mole';
    node.onclick = function(e) {
      e.target.checked = false;
      Mole.hit(e.target.value);
    };
    frag.appendChild(node);
  }
  $('moles').appendChild(frag);
  $('startBtn').onclick = Mole.start;
})();
