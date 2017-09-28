// 拖动模块 ----------------------------
let params = {
  left: 0,
  top: 0,
  currentX: 0,
  currentY: 0,
  flag: false
};

let getCss = function(o, key) {
  return o.currentStyle ? o.currentStyle[key] : document.defaultView.getComputedStyle(o, false)[key];
};

let startDrag = function(bar, target, callback) {
  if (getCss(target, "left") !== "auto") {
    params.left = getCss(target, "left");
  }
  if (getCss(target, "top") !== "auto") {
    params.top = getCss(target, "top");
  }
  bar.onmousedown = function(event) {
    if (event.layerY > 80) return;
    params.flag = true;
    if (!event) {
      event = window.event;
      bar.onselectstart = function() {
        return false;
      }
    }
    let e = event;
    params.currentX = e.clientX;
    params.currentY = e.clientY;
  };
  document.onmouseup = function() {
    params.flag = false;
    if (getCss(target, "left") !== "auto") {
      params.left = getCss(target, "left");
    }
    if (getCss(target, "top") !== "auto") {
      params.top = getCss(target, "top");
    }
  };
  document.onmousemove = function(event) {
    let e = event ? event : window.event;
    if (params.flag) {
      let nowX = e.clientX,
        nowY = e.clientY;
      let disX = nowX - params.currentX,
        disY = nowY - params.currentY;
      target.style.left = parseInt(params.left) + disX + "px";
      target.style.top = parseInt(params.top) + disY + "px";
      if (event.preventDefault) {
        event.preventDefault();
      }
      return false;
    }

    if (typeof callback == "function") {
      callback(parseInt(params.left) + disX, parseInt(params.top) + disY);
    }
  }
};

let oBox = document.getElementsByClassName('container')[0];
let oBar = document.getElementsByClassName('all-container')[0];
startDrag(oBar, oBox);
// ---------------------


//  动画效果 ----------------
let delay = false;
//  ie,edge 不兼容 for of 有点无奈
let dom_other = document.getElementsByClassName('button-other')
for (let dom in dom_other) {
  dom_other[dom].onmousemove = function(e) {
    if (delay) {
      delay = false;
      return;
    }
    let val = Math.ceil((e.offsetX / 94) * 100);
    this.style.background = 'linear-gradient(to right, rgb(119,201,219) 0%, rgb(145,217,233) ' + (val + 5) + '%, rgb(145,217,233) ' + (val - 5) + '%, rgb(119,201,219) 100%)';
  }
  dom_other[dom].onmouseout = function(e) {
    this.style.background = 'rgb(244, 244, 244)';
  }
  dom_other[dom].onmousedown = function(e) {
    this.style.background = 'rgb(169, 239, 255)';
    delay = true;
  }
  dom_other[dom].onmouseup = function(e) {
    let val = Math.ceil((e.offsetX / 94) * 100);
    this.style.background = 'linear-gradient(to right, rgb(119,201,219) 0%, rgb(145,217,233) ' + (val + 5) + '%, rgb(145,217,233) ' + (val - 5) + '%, rgb(119,201,219) 100%)';
  }
}

document.getElementsByClassName('button-close')[0].onclick = function(e) {
  document.getElementsByClassName('container')[0].style.display = 'none';
  document.getElementsByClassName('icon')[0].style.display = 'inline';
  buttonCE();
}

document.getElementsByClassName('icon')[0].onclick = function(e) {
  document.getElementsByClassName('icon')[0].style.display = 'none';
  document.getElementsByClassName('container')[0].style.display = 'inline';
  buttonCE();
}


// ----------------------
let str = ''; // 大屏幕
let screen = ''; // 小屏幕
let mem = ''

function upDate(showStr) {
  if (showStr === undefined) showStr = str;
  if (showStr === '') showStr = 0;
  document.getElementById('screen').innerHTML = showStr;
  showScreen();
} // 更新显示

function showScreen(str) {
  if (str === undefined) str = screen;
  let miniScreen = document.getElementsByClassName('mini-screen')[0];
  miniScreen.value = str;
  miniScreen.scrollLeft = screen.length * 10;
}

// -----------------------------
// 辅助函数

function disabled() {
  if(!document.getElementsByClassName('mini-screen')[0].disabled){
    document.getElementsByClassName('mini-screen')[0].focus();
    document.getElementsByClassName('mini-screen')[0].select();
  }
  return !document.getElementsByClassName('mini-screen')[0].disabled;
}

function findInStr(str, char) {
  return (str.split(char)).length - 1;
}

function alertErr() {
  document.getElementsByClassName('notice')[0].style.display = 'inline';
  setTimeout(function() {
    if (document.getElementsByClassName('notice')[0].style.display == 'inline') {
      document.getElementsByClassName('notice')[0].style.display = 'none';
    }
  }, 3000);
} // 错误提示

function alertClear() {
  document.getElementsByClassName('notice')[0].style.display = 'none';
} // 关闭提示

function sum(str) {
  if (!braceMatching(str)) return null;
  str = str.replace(/sin/g, 'Math.sin').replace(/cos/g, 'Math.cos').replace(/tan/g, 'Math.tan').replace(/ln/g, 'Math.log').replace(/sqrt/g, 'Math.sqrt');
  let reg = /([0-9.]*)\^([0-9.]*)/;
  while (reg.test(str)) {
    let arr = str.match(reg);
    str = str.replace(reg, 'Math.pow(' + arr[1] + ',' + arr[2] + ')');
  }
  try {
    let result = eval(str);
    return result;
  } catch (e) {
    return null;
  }
}

function braceMatching(str) { // 括号匹配
  let stack = [];
  for (let i = 0; i < str.length; i++) {
    switch (str[i]) {
      case '(':
        stack.push('(');
        break;
      case ')':
        if (stack.length > 0 && stack[stack.length - 1] == '(') {
          stack.pop();
        } else {
          return false;
        }
        break;
      default:
        break;
    }
  }
  if (stack.length !== 0) return false;
  return true;
}

// -----------------------------
// 按钮事件
function btnNumber() {
  if(disabled())return;
  if (str.length > 17) return; // 数字长度限制 18

  if (this.value === '0' && str === '') return; // 处理开头0

  if (this.value === '.' && str.indexOf('.') != -1) {
    alertErr();
    return;
  } // 处理多个小数点

  if (this.value === '.' && str === '' && isNaN(parseFloat(screen[screen.length - 1]))) {
    str += '0';
    screen += '0';
  } // 处理开头小数点

  str += this.value;
  screen += this.value;
  alertClear();
  upDate();
} // 数字键

function btnOperator() {
  if(disabled())return;
  if (screen === '' && str === '' && document.getElementById('screen').innerHTML !== '') {
    screen += document.getElementById('screen').innerHTML;
  }
  if (this.value !== '-' && screen === '') {
    alertErr();
    return;
  }
  str = '';
  screen += this.value;
  upDate(this.value);
} // 运算符

function buttonLeft() { // 左括号
  if(disabled())return;
  if (!isNaN(parseInt(screen[screen.length - 1]))) {
    alertErr();
    return;
  }
  str = '';
  screen += '(';
  upDate('(');
}

function buttonRight() { // 右括号
  if(disabled())return;
  if (findInStr(screen, '(') - findInStr(screen, ')') > 0) {
    str = '';
    screen += ')';
    upDate(')');
  } else {
    alertErr();
  }
}

Math.formatFloat = function(f, digit) { 
  var m = Math.pow(10, digit); 
  return parseInt(f * m, 10) / m; 
} 


function buttonSum() { // 等于号
  if(disabled())return;
  alertClear();
  let result = sum(screen);
  if (result !== null) {
    if (!isNaN(parseFloat(result))) {
      result = Math.formatFloat(result, 10); // 修正计算精度问题
    }
    str = '';
    let temp = screen + '=';
    screen = '';
    upDate(result);
    showScreen(temp);
  } else {
    alertErr();
  }
}

function buttonInput() {
  if(document.getElementsByClassName('mini-screen')[0].disabled){
    document.getElementsByClassName('mini-screen')[0].disabled = false;
    document.getElementsByClassName('mini-screen')[0].focus();
    document.getElementsByClassName('mini-screen')[0].select();
    document.getElementById('button-input').innerHTML = 'OK';
  } else {
    document.getElementsByClassName('mini-screen')[0].disabled = true;
    screen = document.getElementsByClassName('mini-screen')[0].value;
    if(screen === '') return;
    if(screen[screen.length - 1] === '=') screen = screen.substr(0, screen.length - 1);
    buttonSum();
    document.getElementById('button-input').innerHTML = 'Input';
  }
}

let showHistory = false;
function buttonHistory() {
  if(showHistory){
    document.getElementsByClassName('history')[0].style = 'width: 0px; height: 0px; opacity: 0;transition: all .2s ease .1s;'
    document.getElementsByClassName('container')[0].style = 'width: 500px;'
    document.getElementsByClassName('detail')[0].style = 'height:0px;'
  } else {
    document.getElementsByClassName('container')[0].style = 'width: 800px;'
    document.getElementsByClassName('history')[0].style = 'width: 280px; height: 380px; opacity: 1;transition: all .2s ease .5s;'
    document.getElementsByClassName('detail')[0].style = 'height:330px;'
  }
  showHistory = !showHistory;
}


function buttonBack() { // 退格
  if(disabled())return;
  if (screen.length > 0) {
    if (screen[screen.length - 1] === '.' && screen[screen.length - 2] === '0') screen = screen.substr(0, screen.length - 1);
    screen = screen.substr(0, screen.length - 1);
  }
  upDate();
  if (str.length > 1) {
    if (str[str.length - 1] === '.' && str[str.length - 2] === '0') str = str.substr(0, str.length - 1);
    str = str.substr(0, str.length - 1);
    upDate();
  } else if (str.length === 1) {
    str = '';
    upDate(0);
    return;
  }
}

function buttonCE() { // CE
  str = '';
  screen = '';
  upDate();
  document.getElementById('screen').innerHTML = '0';
}

function btnFun() {
  if(disabled())return;
  let num = document.getElementById('screen').innerHTML;
  if (screen === '' && str === '' && num !== '' && !isNaN(parseFloat(num))) {
    screen += this.value + '(' + num + ')';
    upDate(this.value);
    return;
  }
  if (!isNaN(parseFloat(screen[screen.length - 1]))) {
    alertErr();
    return;
  }
  screen += this.value + '(';
  upDate(this.value);
  str = '';
}

function buttonMS() {
  if(disabled())return;
  mem = document.getElementById('screen').innerHTML;
}

function buttonMR() {
  if(disabled())return;
  str = mem;
  screen += mem;
  upDate();
}
// 绑定事件---------
let dom_num = document.getElementsByClassName('button-num');
for (let i in dom_num) {
  dom_num[i].onclick = btnNumber;
}
let dom_operator = document.getElementsByClassName('button-operator');
for (let i in dom_operator) {
  dom_operator[i].onclick = btnOperator;
}
let dom_fun = document.getElementsByClassName('button-fun');
for (let i in dom_fun) {
  dom_fun[i].onclick = btnFun;
}

document.getElementsByClassName('notice')[0].onclick = alertClear;
document.getElementById('button-left').onclick = buttonLeft;
document.getElementById('button-right').onclick = buttonRight;
document.getElementById('button-sum').onclick = buttonSum;
document.getElementById('button-back').onclick = buttonBack;
document.getElementById('button-ce').onclick = buttonCE;
document.getElementById('button-ms').onclick = buttonMS;
document.getElementById('button-mr').onclick = buttonMR;
document.getElementById('button-input').onclick = buttonInput;
document.getElementById('button-history').onclick = buttonHistory;

//--------------

// 绑定按钮
document.onkeyup = function(event) {
  if(!document.getElementsByClassName('mini-screen')[0].disabled) return;
  var e = event || window.event;
  var keyCode = e.keyCode || e.which;
  switch (keyCode) {
    case 49:
    case 97:
      document.getElementById('btn_1').click();
      break;
    case 50:
    case 98:
      document.getElementById('btn_2').click();
      break;
    case 51:
    case 99:
      document.getElementById('btn_3').click();
      break;
    case 52:
    case 100:
      document.getElementById('btn_4').click();
      break;
    case 53:
    case 101:
      document.getElementById('btn_5').click();
      break;
    case 54:
    case 102:
      document.getElementById('btn_6').click();
      break;
    case 55:
    case 103:
      document.getElementById('btn_7').click();
      break;
    case 56:
    case 104:
      document.getElementById('btn_8').click();
      break;
    case 57:
    case 105:
      document.getElementById('btn_9').click();
      break;
    case 48:
    case 96:
      document.getElementById('btn_0').click();
      break;
    case 110:
      document.getElementById('btn_point').click();
      break;
    case 219:
      document.getElementById('button-left').click();
      break;
    case 221:
      document.getElementById('button-right').click();
      break;
    case 107:
      document.getElementById('btn_plus').click();
      break;
    case 109:
      document.getElementById('btn_reduce').click();
      break;
    case 106:
      document.getElementById('btn_x').click();
      break;
    case 111:
      document.getElementById('btn_division').click();
      break;
    case 13:
      document.getElementById('button-sum').click();
      break;
    case 8:
      document.getElementById('button-back').click();
      break;
    default:
      break;
  }
}

/*  逆波兰算法
Array.prototype.top = function() {
  if (this.length > 0) {
    return this[this.length - 1];
  } else {
    return null;
  }
}
Array.prototype.front = function() {
  if (this.length > 0) {
    return this[0];
  } else {
    return null;
  }
}

function getPriority(char) {
  if (char === '+' || char === '-') {
    return 1;
  } else if (char === '(' || char === null) {
    return 0;
  } else if (char === '*' || char === '/') {
    return 2;
  }
  return null;
}

function dealStr(str) {
  let stackOperator = [];
  let stackStr = [];
  let stackNum = [];
  for (let i = 0; i < str.length; i++) {
    // console.log(stackOperator, stackStr, stackNum);
    if (!isNaN(parseFloat(str[i])) || str[i] === '.') { // 为数字
      stackNum.push(str[i]);
      continue;
    } else if (stackNum.length > 0) {
      if (stackNum.indexOf('.', stackNum.indexOf('.') + 1) !== -1) {
        return null;
      }
      stackStr.push(parseFloat(stackNum.join('')));
      stackNum = [];
    }
    if (str[i] === '(') {
      stackOperator.push(str[i]);
    } else if (str[i] === ')') {
      while (stackOperator.top() !== '(') {
        stackStr.push(stackOperator.pop());
      }
      stackOperator.pop();
    } else if (str[i] === '+' || str[i] === '-' || str[i] === '*' || str[i] === '/') {
      while (getPriority(str[i]) <= getPriority(stackOperator.top())) {
        stackStr.push(stackOperator.pop());
      }
      stackOperator.push(str[i]);
    }
  }
  if (stackNum.length > 0) {
    stackStr.push(parseFloat(stackNum.join('')));
  }
  while (stackOperator.length > 0) {
    stackStr.push(stackOperator.pop());
  }
  return stackStr;
  // 处理为逆波兰算式
}

function sum(str) {
  if (braceMatching(str) === false) return null;
  let stackStr = dealStr(str);
  if (stackStr === null) {
    alertErr();
    return null;
  }
  let stackNew = [];
  while (stackStr.front() !== null) {
    //console.log('top', stackStr.front());
    if (!isNaN(parseFloat(stackStr.front()))) { // 为数字
      stackNew.push(parseFloat(stackStr.front()));
    } else {
      let b = parseFloat(stackNew.pop());
      let a = parseFloat(stackNew.pop());
      //console.log('a', a, 'b', b);
      if (stackStr.front() === '+') stackNew.push(a + b);
      if (stackStr.front() === '-') stackNew.push(a - b);
      if (stackStr.front() === '*') stackNew.push(a * b);
      if (stackStr.front() === '/') stackNew.push(a / b);
    }
    stackStr.splice(0, 1);
  }
  //console.log(stackStr, stackNew);
  return stackNew[0];
  // 计算逆波兰算式结果
}
 */
