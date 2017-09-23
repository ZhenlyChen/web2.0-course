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
  let miniScreen = document.getElementsByClassName('mini-screen')[0];
  miniScreen.value = screen;
  miniScreen.scrollLeft = screen.length * 10;
} // 更新显示


function btnNumber() {
  if (str.length > 17) return; // 数字长度限制 18

  if (this.value === '0' && str === '') return; // 处理开头0

  if (this.value === '.' && str.indexOf('.') != -1) {
    alertErr();
    return;
  } // 处理多个小数点

  if (this.value === '.' && str === '') {
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
    alertErr();
    return;
  }
  str = '';
  screen += this.value;
  upDate(this.value);
} // 运算符

function buttonLeft() { // 左括号
  if (!isNaN(parseInt(str[str.length - 1]))) {
    alertErr();
    return;
  }
  str = '';
  screen += '(';
  upDate('(');
}

function buttonRight() { // 右括号
  if (findInStr(screen, '(') - findInStr(screen, ')') > 0) {
    str = '';
    screen += ')';
    upDate(')');
  } else {
    alertErr();
  }
}

function buttonSum() { // 等于号

}

function buttonBack() { // 退格
  if (screen.length > 0) {
    screen = screen.substr(0, screen.length - 1);
    upDate();
  }
  if (str.length > 1) {
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

for (let dom of document.getElementsByClassName('button-num')) {
  dom.onclick = btnNumber;
}

for (let dom of document.getElementsByClassName('button-operator')) {
  dom.onclick = btnOperator;
}

document.getElementsByClassName('notice')[0].onclick = alertClear;
document.getElementById('button-left').onclick = buttonLeft;
document.getElementById('button-right').onclick = buttonRight;
document.getElementById('button-sum').onclick = buttonSum;
document.getElementById('button-back').onclick = buttonBack;
document.getElementById('button-ce').onclick = buttonCE;

//--------------
