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
// ---------------------


//  动画效果 ----------------
for (let dom of document.getElementsByClassName('button-other')) {
  dom.onmousemove = function(e) {
    let val = Math.ceil((e.offsetX / 94) * 100);
    this.style.background = 'linear-gradient(to right, rgb(119,201,219) 0%, rgb(145,217,233) ' + (val + 5) + '%, rgb(145,217,233) ' + (val - 5) + '%, rgb(119,201,219) 100%)';
  }
  dom.onmouseout = function(e) {
    this.style.background = 'rgb(244, 244, 244)';
  }
  dom.onmousedown = function(e) {
    this.style.background = 'rgb(169, 239, 255)';
  }
  dom.onmouseup = function(e) {
    let val = Math.ceil((e.offsetX / 94) * 100);
    this.style.background = 'linear-gradient(to right, rgb(119,201,219) 0%, rgb(145,217,233) ' + (val + 5) + '%, rgb(145,217,233) ' + (val - 5) + '%, rgb(119,201,219) 100%)';
  }
}

document.getElementsByClassName('button-close')[0].onclick = function(e) {
  document.getElementsByClassName('container')[0].style.display = 'none';
  document.getElementsByClassName('icon')[0].style.display = 'inline';
}

document.getElementsByClassName('icon')[0].onclick = function(e) {
  document.getElementsByClassName('icon')[0].style.display = 'none';
  document.getElementsByClassName('container')[0].style.display = 'inline';

}


// ----------------------
let str = '';
let screen = '0';

function upDate() {
  document.getElementById('screen').innerHTML = str;
  document.getElementsByClassName('mini-screen')[0].innerHTML = screen;
}

for (let dom of document.getElementsByClassName('button-num')) {
  dom.onclick = function() {
    if (str.length > 17) return;
    str += this.value;
    upDate();
  }
}

let oBox = document.getElementsByClassName('container')[0];
let oBar = document.getElementsByClassName('all-container')[0];
startDrag(oBar, oBox);
