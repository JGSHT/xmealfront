<template>
  <div class="center">
    <div style="padding-top: 45%">
      <x-input title="帐号" name="account" placeholder="请输入帐号" v-model.trim="loginForm.account"></x-input>
      <x-input title="密码" name="password" type="password" :max="11" placeholder="请输入密码" v-model.trim="loginForm.password" style="margin-top: 10px"></x-input>
      <check-icon :value.sync="saveCookie">一周内记住密码</check-icon>
      <button type="button" class="btn-confirm" @click="login()">登录</button>
    </div>
  </div>
</template>

<script>
  import {CheckIcon, XSwitch, XInput, XButton, querystring, cookie} from 'vux'

  export default {
    created () {
      this.getCookie()
    },
    components: {
      CheckIcon,
      XSwitch,
      XInput,
      XButton,
      querystring,
      cookie
    },
    data () {
      return {
        stationId: '',
        stringValue: '0',
        saveCookie: true,
        loginForm: {
          account: '',
          password: ''
        }
      }
    },
    methods: {
      // 注册
      login () {
        if (this.loginForm.account === '') {
          console.log(1);
          this.$vux.toast.show({
            type: 'text',
            text: '请输入帐号',
            position: 'middle'
          })
        } else if (this.loginForm.password === '') {
          this.$vux.toast.show({
            type: 'text',
            text: '请输入密码',
            position: 'middle'
          })
        } else {
          var params = {
            request: {
              account: this.loginForm.account,
              password: this.loginForm.password
            }
          }
          // console.log(this.loginForm.account + this.loginForm.password)
          this.$http.post('/api/public/stockCountAPI/login', params).then(res => {
            console.log(1);
            if (res.body.code === 0) {
              if (this.saveCookie === true) {
                this.setCookie(this.loginForm.account, this.loginForm.password, 7)
              } else {
                this.clearCookie()
              }
              cookie.set('X-AUTH-TOKEN', res.body.response.token, {
                expires: 1
              })
              if (res.body.response.roleId === '26' || res.body.response.roleId === 26) {
                this.$router.push({path: '/deliveryChoose',
                  params: {
                    id: res.body.response.id,
                    name: res.body.response.name,
                    companyName: res.body.response.companyName,
                    companyId: res.body.response.companyId
                  }
                })
              } else {
                this.$router.push({path: '/stockCountMachine',
                  query: {
                    id: res.body.response.id,
                    name: res.body.response.name,
                    companyName: res.body.response.companyName,
                    companyId: res.body.response.companyId
                  }
                })
              }
            } else {
              this.$vux.toast.show({
                type: 'text',
                text: res.body.desc,
                position: 'middle',
                width: '10em'
              })
            }
          })
        }
      },
      // 设置cookie
      setCookie (name, pwd, exdays) {
        var exdate = new Date() // 获取时间
        exdate.setTime(exdate.getTime() + 24 * 60 * 60 * 1000 * exdays) // 保存的天数
        // 字符串拼接cookie
        window.document.cookie = 'userName' + '=' + name + ';path=/;expires=' + exdate.toGMTString()
        window.document.cookie = 'userPwd' + '=' + pwd + ';path=/;expires=' + exdate.toGMTString()
      },
      // 读取cookie
      getCookie: function () {
        if (document.cookie.length > 0) {
          var arr = document.cookie.split('; ') // 这里显示的格式需要切割一下自己可输出看下
          for (var i = 0; i < arr.length; i++) {
            var arr2 = arr[i].split('=') // 再次切割
            // 判断查找相对应的值
            if (arr2[0] === 'userName') {
              this.loginForm.account = arr2[1] // 保存到保存数据的地方
            } else if (arr2[0] === 'userPwd') {
              this.loginForm.password = arr2[1]
            }
          }
        }
      },
      // 清除cookie
      clearCookie: function () {
        this.setCookie('', '', -1)  // 修改2值都为空，天数为负1天就好了
      }
    }
  }
</script>

<style lang="less">
  html,body {
    width: 100%;
    height: 100%;
    background-color: #f5f5f5;
    font-family: PingFangSC-Regular, sans-serif;
  }
  #app{
    height: 100%;
  }
  .center {
    background-image: url("../../assets/timg.jpg");
    height: 100%;
    text-align: center;
    .btn-code {
      display: block;
      background-color: #91bb35;
      color: #fff;
      border: none;
      font-size: 12px;
      width: 70px;
      height: 25px;
      margin-left: 10px;
      border-radius: 5px;
      &:disabled {
        background-color: #ccc;
      }
    }
    .btn-confirm {
      width: 30%;
      height: 40px;
      margin: 30px auto 0;
      display: block;
      font-size: 15px;
      color: #fff;
      background-color: #91bb35;
      border: none;
      border-radius: 20px;
      &:active {
        background-color: #7abb35;
      }
    }
  }
</style>
