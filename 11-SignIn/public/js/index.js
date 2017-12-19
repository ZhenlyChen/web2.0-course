const $ = name => {
  return document.getElementById(name)
}

function getQueryString (name) {
  let reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
  let r = window.location.search.substr(1).match(reg);
  if (r != null) return unescape(r[2]); return null;
}

window.onload = () => {
  if (getQueryString('register') === 'true') {
    notice.show('注册成功，请登陆')
  }
}

const checkRule = {
  name: t => true
}

const notice = {
  show: text => {
    notice.hide()
    setTimeout(() => {
      $('notice').innerText = text
      $('notice').className = 'notice notice-show'
      clearTimeout(notice.timer)
      notice.timer = setTimeout(notice.hide, 3000)
    }, 500)
  },
  hide: () => {
    $('notice').className = 'notice notice-hide'
  }
}

function checkInput (e, rule, text) {
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

$('register').onclick = e => {
  window.location.href = '/regist'
}

$('userName').onchange = e => {
  return checkInput(e.target, 'name', '用户名6~18位英文字母、数字或下划线，必须以英文字母开头')
}

$('submit').onclick = e => {
  if (!$('userName').onchange({ target: $('userName') })) {
    $('userName').focus()
    return
  }
  if ($('userPass').value === '') {
    notice.show('请输入密码')
    $('userPass').focus()
    return
  }

  async function submit () {
    try {
      let userName = $('userName').value
      if (userName === '') {
        $('userName').className = 'errorInput'
        notice.show('请输入用户名')
        return
      }
      let res = await axios.post('/api/login', {
        name: $('userName').value,
        password: $('userPass').value
      })
      if (res.data.state === true) {
        window.location.href = '/?username=' + userName
      } else {
        notice.show('用户名或密码错误')
        $('userPass').focus()
        $('userPass').className = 'errorInput'
      }
    } catch (error) {
      notice.show('无法连接到服务器，请重试')
    }
  }
  submit()
}
