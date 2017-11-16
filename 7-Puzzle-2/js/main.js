let gameStart = false;
let hard = 5;

function setPosition(target, i) {
  target.setAttribute('position', i);
  target.className = target.className.replace(/puzzle-[0-9]{1,2}/, 'puzzle-' + i);
}

function puzzleInit() {
  let puzzle = [];
  for (let i = 1; i <= 16; i++) {
    puzzle.push(i);
  }
  let flag = document.createDocumentFragment();
  Array.from(puzzle, (t) => {
    let node = document.createElement('div');
    node.className = t === 16 ? '' : 'puzzle-block img-' + t;
    node.className += ' puzzle-part puzzle-' + t;
    node.id = t;
    //node.src = 'images/' + t + '.gif';
    node.onclick = puzzleClick;
    node.setAttribute('position', t);
    flag.appendChild(node);
  })
  flag.lastElementChild.className += ' blank-block';
  document.getElementById('puzzle').innerHTML = '';
  document.getElementById('puzzle').appendChild(flag);
}

function simGenerate() {
  let puzzle = [];
  for (let i = 1; i <= 16; i++) {
    puzzle.push(i);
  }
  let position = 15;
  for (let i = 1; i < 50 * hard; i++) {
    let random = Math.ceil(Math.random() * 4);
    let target = position;
    switch (random) {
      case 1:
        target += 1;
        break;
      case 2:
        target += 4;
        break;
      case 3:
        target -= 1;
        break;
      case 4:
        target -= 4;
        break;
    }
    let Tx = target % 4;
    let Ty = Math.floor(target / 4);
    let Px = position % 4;
    let Py = Math.floor(position / 4);
    if (Math.abs(Tx - Px) <= 1 && Math.abs(Ty - Py) <= 1 && target >= 0 && target <= 15) {
      let tmp = puzzle[position];
      puzzle[position] = puzzle[target];
      puzzle[target] = tmp;
      position = target;
    }
  }
  let Px = position % 4;
  while (Px != 3) {
    let target = position + 1;
    let tmp = puzzle[position];
    puzzle[position] = puzzle[target];
    puzzle[target] = tmp;
    position = target;
    Px = position % 4;
  }
  let Py = Math.floor(position / 4);
  while (Py != 3) {
    let target = position + 4;
    let tmp = puzzle[position];
    puzzle[position] = puzzle[target];
    puzzle[target] = tmp;
    position = target;
    Py = Math.floor(position / 4);
  }
  puzzle.pop();
  return puzzle.reverse();
}

function puzzleStart() {
  let puzzle = simGenerate();
  let block = document.getElementsByClassName('puzzle-block');
  Array.from(block, (e) => {
    let num = puzzle.pop();
    if (!num) num = 16;
    setPosition(e, num);
  });
  setPosition(document.getElementById('16'), 16);
  gameStart = true;
}

function puzzleClick(e) {
  if (!gameStart) return;
  let blank = document.getElementById('16');
  let blankBlock = parseInt(blank.getAttribute('position'));
  let self = parseInt(this.getAttribute('position'));
  switch (blankBlock) {
    case self + 1:
    case self - 1:
    case self + 4:
    case self - 4:
      setPosition(this, blankBlock);
      setPosition(blank, self);
      break;
    default:
      break;
  }
  checkState();
}

function checkState() {
  let allBlock = document.getElementsByClassName('puzzle-block');
  let success = true;
  Array.from(allBlock, (e) => {
    if (e.id !== e.getAttribute('position')) success = false;
  });
  if (success) {
    setTimeout(() => {
      alert('Success');
      gameStart = false;
    }, 500);
  }
}

function changeHard() {
  let a = parseInt(prompt('请输入难度 (1-10) ', hard));
  if (a >= 1 && a <= 10) {
    hard = a;
    document.getElementById('title').innerText = '拼图游戏 - Lv.' + hard;
    puzzleStart();
  } else {
    alert('输入无效');
  }
}

(() => {
  puzzleInit();
  document.getElementById('start').onclick = puzzleStart;
  document.getElementById('hard').onclick = changeHard;
})();
