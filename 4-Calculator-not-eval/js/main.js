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
/*   ie,edge 不兼容 for of 有点无奈
for (let dom of document.getElementsByClassName('button-other')) {
  dom.onmousemove = function(e) {
    if (delay) {
      delay = false;
      return;
    }
    let val = Math.ceil((e.offsetX / 94) * 100);
    this.style.background = 'linear-gradient(to right, rgb(119,201,219) 0%, rgb(145,217,233) ' + (val + 5) + '%, rgb(145,217,233) ' + (val - 5) + '%, rgb(119,201,219) 100%)';
  }
  dom.onmouseout = function(e) {
    this.style.background = 'rgb(244, 244, 244)';
  }
  dom.onmousedown = function(e) {
    this.style.background = 'rgb(169, 239, 255)';
    delay = true;
  }
  dom.onmouseup = function(e) {
    let val = Math.ceil((e.offsetX / 94) * 100);
    this.style.background = 'linear-gradient(to right, rgb(119,201,219) 0%, rgb(145,217,233) ' + (val + 5) + '%, rgb(145,217,233) ' + (val - 5) + '%, rgb(119,201,219) 100%)';
  }
} */

//-------------------------------------------------------
//
//
// 这个没办法写在css里面，因为是要根据鼠标事件做出响应的！
// 这个没办法写在css里面，因为是要根据鼠标事件做出响应的！
// 这个没办法写在css里面，因为是要根据鼠标事件做出响应的！
//
//
//
//-----------------------------------------------------
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

function btnNumber() {
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
  if (screen === '') {
    if (document.getElementById('screen').innerHTML === '') {
      upDate();
      alertErr();
      return;
    } else {
      screen += document.getElementById('screen').innerHTML;
    }
  }
  if (screen[screen.length - 1] === '+' ||
    screen[screen.length - 1] === '-' ||
    (screen[screen.length - 1] === '*') ||
    screen[screen.length - 1] === '/' ||
    screen[screen.length - 1] === '(') {
    alertErr();
    return;
  }
  str = '';
  screen += this.value;
  upDate(this.value);
} // 运算符

function buttonLeft() { // 左括号
  if (!isNaN(parseInt(screen[screen.length - 1]))) {
    alertErr();
    return;
  }
  str = '';
  screen += '(';
  upDate('(');
}

function buttonRight() { // 右括号
  if (isNaN(parseInt(screen[screen.length - 1]))) {
    alertErr();
    return;
  }

  if (findInStr(screen, '(') - findInStr(screen, ')') > 0) {
    str = '';
    screen += ')';
    upDate(')');
  } else {
    alertErr();
  }
}

function buttonSum() { // 等于号
  let result = sum(screen);
  if (result !== null) {
    str = '';
    let temp = screen + '=';
    screen = '';
    upDate(result);
    showScreen(temp);
  } else {
    alertErr();
  }
}

function buttonBack() { // 退格
  if (screen.length > 0) {
    if (screen[screen.length - 1] === '.' && screen[screen.length - 2] === '0') screen = screen.substr(0, screen.length - 1);
    screen = screen.substr(0, screen.length - 1);
  }
  upDate();
  if (str.length > 1) {
    if (str[str.length - 1] === '.' && str[str.length - 2] === '0') str = str.substr(0, str.length - 1);
    str = str.substr(0, str.length - 1);
    /* if (str === '0') { // 处理小数点前的0
      str = str.substr(0, str.length - 1);
      screen = screen.substr(0, screen.length - 1);
    } */
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
      if (stackStr.front() === '+') stackNew.push(a.add(b));
      if (stackStr.front() === '-') stackNew.push(a.sub(b));
      if (stackStr.front() === '*') stackNew.push(a.mul(b));
      if (stackStr.front() === '/') stackNew.push(a.div(b));
    }
    stackStr.splice(0, 1);
  }
  //console.log(stackStr, stackNew);
  return stackNew[0];
  // 计算逆波兰算式结果
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

// 绑定事件---------
/*  es6 ie edge 不能运行
for (let dom of document.getElementsByClassName('button-num')) {
  dom.onclick = btnNumber;
}

for (let dom of document.getElementsByClassName('button-operator')) {
  dom.onclick = btnOperator;
}
 */
let dom_num = document.getElementsByClassName('button-num');
for (let i in dom_num) {
  dom_num[i].onclick = btnNumber;
}
let dom_operator = document.getElementsByClassName('button-operator');
for (let i in dom_operator) {
  dom_operator[i].onclick = btnOperator;
}

document.getElementsByClassName('notice')[0].onclick = alertClear;
document.getElementById('button-left').onclick = buttonLeft;
document.getElementById('button-right').onclick = buttonRight;
document.getElementById('button-sum').onclick = buttonSum;
document.getElementById('button-back').onclick = buttonBack;
document.getElementById('button-ce').onclick = buttonCE;

//--------------

// 绑定按钮
document.onkeyup = function(event) {
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
    case 187:
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


function accDiv(arg1, arg2) {
  var t1 = 0,
    t2 = 0,
    r1, r2;
  try { t1 = arg1.toString().split(".")[1].length } catch (e) {}
  try { t2 = arg2.toString().split(".")[1].length } catch (e) {}
  with(Math) {
    r1 = Number(arg1.toString().replace(".", ""));
    r2 = Number(arg2.toString().replace(".", ""));
    return (r1 / r2) * pow(10, t2 - t1);
  }
}

Number.prototype.div = function(arg) {
  return accDiv(this, arg);
};

function accMul(arg1, arg2) {
  var m = 0,
    s1 = arg1.toString(),
    s2 = arg2.toString();
  try { m += s1.split(".")[1].length } catch (e) {}
  try { m += s2.split(".")[1].length } catch (e) {}
  return Number(s1.replace(".", "")) * Number(s2.replace(".", "")) / Math.pow(10, m);
}

Number.prototype.mul = function(arg) {
  return accMul(arg, this);
};

function accAdd(arg1, arg2) {
  var r1, r2, m;
  try { r1 = arg1.toString().split(".")[1].length } catch (e) { r1 = 0 }
  try { r2 = arg2.toString().split(".")[1].length } catch (e) { r2 = 0 }
  m = Math.pow(10, Math.max(r1, r2));
  return (arg1 * m + arg2 * m) / m;
}

Number.prototype.add = function(arg) {
    return accAdd(arg, this);
  }
  //减法函数
function accSub(arg1, arg2) {
  var r1, r2, m, n;
  try { r1 = arg1.toString().split(".")[1].length } catch (e) { r1 = 0 }
  try { r2 = arg2.toString().split(".")[1].length } catch (e) { r2 = 0 }
  m = Math.pow(10, Math.max(r1, r2));
  n = (r1 >= r2) ? r1 : r2;
  return ((arg2 * m - arg1 * m) / m).toFixed(n);
}
Number.prototype.sub = function(arg) {
  return accSub(arg, this);
}
