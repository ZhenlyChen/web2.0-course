"use strict";
let gameStart = false;
let goOut = false;

function $(id) {
  return document.getElementById(id);
}

function gameOver() {
  gameStart = false;
  $('gameBox').className = 'game-box';
  $('tip').innerHTML = 'You Lose'
  $('tip').className = 'tip tip-show';
}

function touchWall(e) {
  if (gameStart) {
    let oldClass = e.target.className;
    gameOver();
    e.target.className += ' red-wall';
    setTimeout(function(e) {
      e.target.className = oldClass;
    }, 1000, e);
  }
}

function clearWall() {
  for (let wall of document.getElementsByName('walls')) {
    wall.className = wall.className.replace(/red-wall/g, '');
  }
}

for (let wall of document.getElementsByName('walls')) {
  wall.onmouseenter = touchWall;
}

// 开始游戏
$('start').onmousemove = function(e) {
  gameStart = true;
  goOut = false;
  clearWall();
  $('tip').className = 'tip tip-hide';
  $('gameBox').className = 'game-box pointer-hand';
}

$('end').onmousemove = function(e) {
  if (gameStart) {
    if (goOut) {
      $('tip').innerHTML = 'Don\'t cheat, you should start from the \'S\' adn move to the \'E\' inside the maze!';
    } else {
      $('tip').innerHTML = 'You Win';
    }
    gameStart = false;
    $('tip').className = 'tip tip-show';
  }
  $('gameBox').className = 'game-box';
}

$('gameBox').onmouseleave = function(e) {
  if (gameStart) {
    goOut = true;
  }
}

$('gameBox').onmousedown = function(e) {
  gameStart = false;
  $('gameBox').className = 'game-box';
  $('tip').innerHTML = 'You Can\'t Click!';
  $('tip').className = 'tip tip-show';
}
