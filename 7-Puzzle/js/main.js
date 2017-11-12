function puzzleInit() {
  let puzzle = [];
  for (let i = 1; i < 16; i++) {
    puzzle.push(i);
  }
  let flag = document.createDocumentFragment();
  Array.from(puzzle, (t) => {
    let node = document.createElement('img');
    node.className = 'puzzle-part';
    node.name = 'puzzle-block';
    node.id = t;
    node.src = 'images/' + t + '.gif';
    node.onclick = puzzleClick;
    flag.appendChild(node);
  })
  let node = document.createElement('img');
  node.className = 'puzzle-part blank-block';
  node.src = 'images/16.gif';
  node.style.order = '16';
  node.id = '16';
  flag.appendChild(node);
  document.getElementById('puzzle').innerHTML = '';
  document.getElementById('puzzle').appendChild(flag);
}

function puzzleStart() {
  let puzzle = [];
  for (let i = 1; i < 16; i++) {
    puzzle.push(i);
  }
  puzzle.sort(() => {
    return Math.random() - 0.5;
  })
  let block = document.getElementsByName('puzzle-block');
  Array.from(block, (e) => {
    e.style.order = puzzle.pop();
  });
  document.getElementById('16').style.order = 16;
}

function puzzleClick() {
  let blank = document.getElementById('16');
  let other = parseInt(blank.style.order);
  let self = parseInt(this.style.order);
  switch (other) {
    case self + 1:
    case self - 1:
    case self + 4:
    case self - 4:
      this.style.order = other;
      blank.style.order = self;
      break;
    default:
      break;
  }
  let allBlock = document.getElementsByName('puzzle-block');
  let success = true;
  Array.from(allBlock, (e) => {
    if (e.id !== e.style.order) success = false;
  });
  if (success) alert('Success');
}

(() => {
  puzzleInit();
  document.getElementById('start').onclick = puzzleStart;
})();
