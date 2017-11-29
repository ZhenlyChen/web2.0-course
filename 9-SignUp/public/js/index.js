const $ = name => {
  return document.getElementById(name)
}

const checkRule = {
  name: t => /^[a-zA-Z][a-zA-Z0-9_]{5,17}$/.test(t),
  id: t => /^[1-9][0-9]{7}$/.test(t),
  phone: t => /^[1-9][0-9]{10}$/.test(t),
  email: t => /^\w+([-+.']\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/.test(t)
}

const notice = {
  show: text => {
    $('notice').innerText = text
    $('notice').className = 'notice notice-show'
    if (this.timer) clearTimeout(this.timer)
    this.timer = setTimeout(this.hide, 5000)
  },
  hide: () => {
    $('notice').className = 'notice notice-hide'
  }
}

function checkInput(e, rule, text) {
  if (checkRule[rule](e.value)) {
    e.className = 'rightInput'
    notice.hide()
    return true
  } else {
    e.className = 'errorInput'
    notice.show(text)
    return false
  }
}

$('reset').onclick = e => {
  Array.from(document.getElementsByName('input'), input => {
    input.className = ''
    input.value = ''
  })
  notice.hide()
  $('userName').focus()
}

$('userName').onchange = e => {
  return checkInput(e.target, 'name', '用户名6~18位英文字母、数字或下划线，必须以英文字母开头')
}

$('userId').onchange = e => {
  return checkInput(e.target, 'id', '学号8位数字，不能以0开头')
}

$('userPhone').onchange = e => {
  return checkInput(e.target, 'phone', '电话11位数字，不能以0开头')
}

$('userEmail').onchange = e => {
  return checkInput(e.target, 'email', '邮箱格式不合法')
}

$('submit').onclick = e => {
  if (!$('userName').onchange({ target: $('userName') })) {
    $('userName').focus()
    return
  }
  if (!$('userId').onchange({ target: $('userId') })) {
    $('userId').focus()
    return
  }
  if (!$('userPhone').onchange({ target: $('userPhone') })) {
    $('userPhone').focus()
    return
  }
  if (!$('userEmail').onchange({ target: $('userEmail') })) {
    $('userEmail').focus()
    return
  }
  async function submit() {
    let res = await axios.post('/api/register', {
      name: $('userName').value,
      id: $('userId').value,
      phone: $('userPhone').value,
      email: $('userEmail').value,
    })
    if (res.data.state === true) {
      window.location.href = '/?username=' + $('userName').value
    } else {
      switch (res.data.state) {
        case 'name':
          notice.show('用户名重复')
          $('userName').focus()
          break
        case 'id':
          notice.show('学号重复')
          $('userId').focus()
          break
        case 'phone':
          notice.show('手机号码重复')
          $('userPhone').focus()
          break
        case 'email':
          notice.show('邮箱重复')
          $('userEmail').focus()
          break
        default:
          notice.show('非法操作')
      }

    }
  }
  submit()
}

window.onkeydown = e => {
  if (e.keyCode === 13) {
    $('submit').click()
  }
}
