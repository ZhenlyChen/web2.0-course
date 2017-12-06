function ctrl() {
  let Ctrl = {
    auto: function() {
      document.getElementById('apb').onclick = () => {}
      this.clean()
      let order = [{
        f: this.aHandler,
        n: 'A'
      }, {
        f: this.bHandler,
        n: 'B'
      }, {
        f: this.cHandler,
        n: 'C'
      }, {
        f: this.dHandler,
        n: 'D'
      }, {
        f: this.eHandler,
        n: 'E'
      }, ]
      order.sort(() => (Math.random() - 0.5))
      this.message.innerText = ''
      Array.from(order, e => {
        this.message.innerText += e.n + ','
      })
      this.message.innerText = this.message.innerText.substr(0, this.message.innerText.length - 1)
      order.push({
        f: this.bubbleHandler,
        n: 'Big'
      })

      function errDeal(err) {
        this.message.innerText = err.message
        err.e[0].f(err.e, err.all, errDeal)
      }
      order[0].f(order, 0, errDeal)
    },
    clean: function() {
      this.message.innerText = ''
      this.total.innerText = ''
      Array.from(document.getElementsByClassName('button'), e => {
        e.classList.add('active')
        e.classList.add('hide')
      })
    },
    aHandler: function(e, all, errorDeal) {
      if (Math.random() < 0.5) {
        errorDeal({
          e: e,
          all: all,
          message: '这不是一个天大的秘密'
        })
        return
      }
      e.splice(0, 1)
      let ring = document.getElementById('ringA')
      let num = document.getElementById('numA')
      num.innerText = '...'
      ring.classList.remove('hide')
      $.get('/getNumber', data => {
        if (!setMessage('这是一个天大的秘密')) return
        ring.classList.remove('active')
        num.innerText = data
        e[0].f(e, all + parseInt(data), errorDeal)
      })
    },
    bHandler: function(e, all, errorDeal) {
      if (Math.random() < 0.5) {
        errorDeal({
          e: e,
          all: all,
          message: '我知道'
        })
        return
      }
      e.splice(0, 1)
      let ring = document.getElementById('ringB')
      let num = document.getElementById('numB')
      num.innerText = '...'
      ring.classList.remove('hide')
      $.get('/getNumber', data => {
        if (!setMessage('我不知道')) return
        ring.classList.remove('active')
        num.innerText = data
        e[0].f(e, all + parseInt(data), errorDeal)
      })
    },
    cHandler: function(e, all, errorDeal) {
      if (Math.random() < 0.5) {
        errorDeal({
          e: e,
          all: all,
          message: '你知道'
        })
        return
      }
      e.splice(0, 1)
      let ring = document.getElementById('ringC')
      let num = document.getElementById('numC')
      num.innerText = '...'
      ring.classList.remove('hide')
      $.get('/getNumber', data => {
        setMessage('你不知道')
        ring.classList.remove('active')
        num.innerText = data
        e[0].f(e, all + parseInt(data), errorDeal)
      })
    },
    dHandler: function(e, all, errorDeal) {
      if (Math.random() < 0.5) {
        errorDeal({
          e: e,
          all: all,
          message: '他知道'
        })
        return
      }
      e.splice(0, 1)
      let ring = document.getElementById('ringD')
      let num = document.getElementById('numD')
      num.innerText = '...'
      ring.classList.remove('hide')
      $.get('/getNumber', data => {
        if (!setMessage('他不知道')) return
        ring.classList.remove('active')
        num.innerText = data
        e[0].f(e, all + parseInt(data), errorDeal)
      })
    },
    eHandler: function(e, all, errorDeal) {
      if (Math.random() < 0.5) {
        errorDeal({
          e: e,
          all: all,
          message: '不怪'
        })
        return
      }
      e.splice(0, 1)
      let ring = document.getElementById('ringE')
      let num = document.getElementById('numE')
      num.innerText = '...'
      ring.classList.remove('hide')
      $.get('/getNumber', data => {
        if (!setMessage('才怪')) return
        ring.classList.remove('active')
        num.innerText = data
        e[0].f(e, all + parseInt(data), errorDeal)
      })
    },
    bubbleHandler: function(e, all, errorDeal) {
      if (Math.random() < 0.5) {
        errorDeal({
          e: e,
          all: all,
          message: '楼主异步调用战斗力感人，目测超过' + all
        })
        return
      }
      if (!setMessage('楼主异步调用战斗力感人，目测不超过' + all)) return
      document.getElementById('total').innerText = all
      document.getElementById('apb').onclick = myCtrl.auto.bind(myCtrl)
    },
  }
  Ctrl.total = document.getElementById('total')
  Ctrl.big = document.getElementById('info-bar')
  Ctrl.message = document.getElementById('message')
  return Ctrl;
}


let myCtrl = new ctrl()

document.getElementById('button').onmouseleave = myCtrl.clean.bind(myCtrl)
document.getElementById('button').onmouseenter = myCtrl.clean.bind(myCtrl)
document.getElementById('apb').onclick = myCtrl.auto.bind(myCtrl)


function setMessage(text) {
  if (document.getElementById('message') !== '') {
    document.getElementById('message').innerText = text
    return true
  } else {
    return false
  }
}
