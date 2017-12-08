function ctrl() {
  let Ctrl = {
    num: [0, 0, 0, 0, 0],
    target: [],
    running: false,
    doneNumber: 0,
    isEnter: false,
    order: [0, 1, 2, 3, 4],
    state: 10,
    auto: function(e) {
      if (e !== undefined && this.running) return;
      this.running = true
      if (this.doneNumber >= 0 && this.doneNumber < 5) {
        if (this.doneNumber === 0) {
          this.order.sort(() => {
            return (Math.random() - 0.5)
          })
          this.message.innerText = ''
          Array.from(this.order, e => {
            this.message.innerText += String.fromCharCode(e + 65) + ','
          })
          this.message.innerText = this.message.innerText.substr(0, this.message.innerText.length - 1)
        }
        if (!this.isEnter) return;
        this.target[this.order[this.doneNumber]].e.autoClick()
      }
      if (this.doneNumber === 5) {
        this.big.click()
        this.running = false
      }
    },
    enter: function() {
      this.clean()
      this.isEnter = true
    },
    clean: function() {
      this.isEnter = false
      this.num = [0, 0, 0, 0, 0]
      this.running = false
      this.doneNumber = 0
      for (let t of this.target) {
        t.e.classList.add('active')
        t.e.classList.add('hide')
      }
      this.total.innerText = ''
      this.message.innerText = ''
    },
    done: function() {
      this.doneNumber++;
      this.ableBtn()
      if (this.doneNumber === 5) {
        let numTotal = 0;
        Array.from(this.num, e => {
          numTotal += e
        })
        this.big.className = 'active'
        this.big.onclick = () => {
          this.total.innerText = numTotal
          this.big.className = ''
        }
      }
      this.auto()
    },
    click: function(id, e) {
      if (this.num[id] !== 0) return
      this.running = true
      this.target[id].e.classList.remove('hide')
      this.target[id].child.innerText = '...'
      this.num[id] = -1
      this.disableBtn()
      let state = this.state
      $.get('/' + (new Date()).getTime(), {}, data => {
        if (!this.isEnter || state !== this.state) return
        this.target[id].e.classList.remove('active')
        this.num[id] = parseInt(data)
        this.target[id].child.innerText = this.num[id]
        this.done()
      })
    },
    setBtn: function(index, e, child) {
      e.autoClick = this.click.bind(this, index)
      this.target[index] = {
        e: e,
        child: child,
      }
    },
    disableBtn: function() {
      for (let i = 0; i < 5; i++) {
        if (this.num[i] > 0 || this.num[i] === -1) continue
        this.target[i].e.classList.remove('active')
      }
    },
    ableBtn: function() {
      for (let i = 0; i < 5; i++) {
        if (this.num[i] !== 0) continue
        this.target[i].e.classList.add('active')
      }
    }
  }
  Ctrl.setBtn(0, document.getElementById('ringA'), document.getElementById('numA'))
  Ctrl.setBtn(1, document.getElementById('ringB'), document.getElementById('numB'))
  Ctrl.setBtn(2, document.getElementById('ringC'), document.getElementById('numC'))
  Ctrl.setBtn(3, document.getElementById('ringD'), document.getElementById('numD'))
  Ctrl.setBtn(4, document.getElementById('ringE'), document.getElementById('numE'))
  Ctrl.total = document.getElementById('total')
  Ctrl.big = document.getElementById('info-bar')
  Ctrl.message = document.getElementById('message')
  return Ctrl;
}


let myCtrl = new ctrl()


document.getElementById('button').onmouseleave = myCtrl.clean.bind(myCtrl)
document.getElementById('button').onmouseenter = myCtrl.enter.bind(myCtrl)
document.getElementById('apb').onclick = () => {
  console.log(myCtrl.running)
  if (!myCtrl.running) {
    myCtrl.running = true
    myCtrl.auto.apply(myCtrl)
  }
}
