function ctrl() {
  let Ctrl = {
    num: [0, 0, 0, 0, 0],
    target: [],
    running: false,
    doneNumber: 0,
    isEnter: false,
    order: [0, 1, 2, 3, 4],
    auto: function() {
      if (this.doneNumber >= 0 && this.doneNumber < 5) {
        if (this.doneNumber === 0) {
          this.order.sort(() => {
            return (Math.random() - 0.5)
          })
        }
        this.target[this.order[this.doneNumber]].e.click()
      }
      if (this.doneNumber === 5) {
        this.big.click()
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
    },
    done: function() {
      this.doneNumber++
        this.running = false
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
    click: function(id) {
      if (this.num[id] !== 0) return
      this.running = true
      this.target[id].e.classList.remove('hide')
      this.target[id].child.innerText = '...'
      this.num[id] = -1
      this.disableBtn()
      $.get('/', {}, data => {
        if (!this.isEnter) return
        this.num[id] = parseInt(data)
        this.target[id].child.innerText = this.num[id]
        this.target[id].e.classList.remove('active')
        this.done()
      })
    },
    setBtn: function(index, e, child) {
      e.onclick = this.click.bind(this, index)
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
  return Ctrl;
}


let myCtrl = new ctrl()


document.getElementById('button').onmouseleave = myCtrl.clean.bind(myCtrl)
document.getElementById('button').onmouseenter = myCtrl.enter.bind(myCtrl)
document.getElementById('apb').onclick = myCtrl.auto.bind(myCtrl)
