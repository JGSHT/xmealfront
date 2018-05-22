<template>
  <div class="login-container">
    <el-form autoComplete="on" :model="loginForm" :rules="loginRules" ref="loginForm" label-position="left" label-width="0px"
      class="card-box login-form">
      <h3 class="title">鲜喵管理系统登录</h3>
      <el-form-item prop="email">
        <span class="svg-container"><icon-svg icon-class="jiedianyoujian"></icon-svg></span>
        <el-input name="email" type="text" v-model="loginForm.email" autoComplete="on" placeholder="邮箱"></el-input>
      </el-form-item>
      <el-form-item prop="password">
        <span class="svg-container"><icon-svg icon-class="mima"></icon-svg></span>
        <el-input name="password" type="password" @keyup.enter.native="handleLogin" v-model="loginForm.password" autoComplete="on"
          placeholder="密码"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" style="width:100%;" :loading="loading" @click.native.prevent="handleLogin">
          登录
        </el-button>
      </el-form-item>
      <el-button type="text" style="margin-left: 80%" @click="changePWDialogVisible = true">修改密码</el-button>
      <!-- <div class='tips'>admin账号为:admin@wallstreetcn.com 密码随便填</div>
      <div class='tips'>editor账号:editor@wallstreetcn.com 密码随便填</div> -->
    </el-form>

    <!-- <el-dialog title="第三方验证" :visible.sync="showDialog">
      邮箱登录成功,请选择第三方验证
      <social-sign></social-sign>
    </el-dialog> -->

    <el-dialog title="修改密码" :visible.sync="changePWDialogVisible"
               :before-close="handleClose">
      <el-row>
        <label style="width: 40%;margin-left: 20%"> 邮 箱 </label>
        <el-input type="text"
                  v-model="email"
                  placeholder="请输入邮箱"
                  clearable
                  style="width: 40%;margin-left: 20px;"></el-input>
      </el-row>
      <el-row style="margin-bottom: 20px">
        <label style="width: 40%;margin-left: 20%">手机号码</label>
        <el-input
        placeholder="请输入手机号码"
        v-model="phone"
        clearable
        style="width: 40%;margin-left: 10px">
      </el-input>
        <el-button @click="getCode" round type="primary" :disabled="codeDisable ? true : false" style="margin-left: 20px">{{codeBtn}}</el-button>
      </el-row>
      <el-row style="margin-bottom: 20px">
        <label style="width: 40%;margin-left: 20%"> 验 证 码 </label><el-input
        placeholder="请输入验证码"
        v-model="code"
        clearable
        style="width: 40%;margin-left: 10px">
      </el-input>
      </el-row>
      <el-row style="margin-bottom: 20px">
        <label style="width: 40%;margin-left: 20%"> 新 密 码 </label><el-input
        placeholder="请输入新密码"
        :maxlength="16"
        :minlength="6"
        v-model="passWord"
        clearable
        style="width: 40%;margin-left: 10px">
      </el-input>
        <el-button
          round type="primary"
          :disabled="changePWDisabled"
          style="margin-left: 20px"
          @click="saveNewPW"
          icon="el-icon-edit">
          修改
        </el-button>
      </el-row>
    </el-dialog>

  </div>
</template>

<script>
  import { isWscnEmail } from 'utils/validate';
  import socialSign from './socialsignin';
  import ElFormItem from "element-ui/packages/form/src/form-item";
  import {fetchCode, fetchSaveNPW} from "../../api/user";

  export default {
    components: {
      ElFormItem,
      socialSign },
    name: 'login',
    data() {
      const validateEmail = (rule, value, callback) => {
        if (!isWscnEmail(value)) {
          callback(new Error('请输入正确的合法邮箱'));
        } else {
          callback();
        }
      };
      const validatePass = (rule, value, callback) => {
        if (value.length < 6) {
          callback(new Error('密码不能小于6位'));
        } else {
          callback();
        }
      };
      return {
        loginForm: {
          email: '',
          password: ''
        },
        loginRules: {
          email: [
                { required: true, trigger: 'blur', validator: validateEmail }
          ],
          password: [
                { required: true, trigger: 'blur', validator: validatePass }
          ]
        },
        loading: false,
        showDialog: false,
        changePWDialogVisible: false,
        codeBtn: '获取验证码',
        phone: '',
        code: '',
        passWord: '',
        email: '',
        codeDisable: false
      }
    },
    computed: {
      changePWDisabled() {
        if (this.code && this.code.length === 6 && this.passWord) {
          return false
        } else {
          return true
        }
      }
    },
    methods: {
      handleLogin() {
        this.$refs.loginForm.validate(valid => {
          if (valid) {
            this.loading = true;
            this.$store.dispatch('LoginByEmail', this.loginForm).then(() => {
              this.loading = false;
              this.$router.push({ path: '/' });
                // this.showDialog = true;
            }).catch(() => {
              this.loading = false;
            });
          } else {
            // console.log('error submit!!');
            return false;
          }
        });
      },
      // 获取手机验证码
      getCode() {
        if (this.email === '') {
          this.$message({
            showClose: true,
            message: '请输入账号',
            duration: 3000,
            type: 'warning'
          });
        } else if(!isWscnEmail(this.email)) {
          this.$message({
            showClose: true,
            message: '请输入正确的合法邮箱',
            duration: 3000,
            type: 'warning'
          });
        } else {
          if (this.phone === '') {
            this.$message({
              showClose: true,
              message: '请输入手机号',
              duration: 3000,
              type: 'warning'
            });
          } else if (!(/^1[34578]\d{9}$/.test(this.phone))) {
            this.$message({
              showClose: true,
              message: '手机号码格式错误',
              duration: 3000,
              type: 'warning'
            });
          } else {
            fetchCode(this.phone, this.email).then(res => {
              if (res.code === 0) {
                this.codeDisable = true
                let num = 60
                let time = setInterval(() => {
                  if (num > 0) {
                    this.codeBtn = num + 's后获取'
                    num--
                  } else {
                    clearInterval(time)
                    this.codeBtn = '获取验证码'
                    this.codeDisable = false
                  }
                }, 1000)
              }
            })
          }
        }
      },
      saveNewPW() {
        if (!this.code || this.code.length !== 6) {
          this.$message({
            showClose: true,
            message: '验证码格式错误',
            duration: 3000,
            type: 'warning'
          });
          return;
        }
        if (!this.passWord || this.passWord.length < 6 || this.passWord.length > 16) {
          this.$message({
            showClose: true,
            message: '新密码位数最少为6位',
            duration: 3000,
            type: 'warning'
          });
          return;
        }
        fetchSaveNPW(this.code, this.passWord, this.email).then(response => {
          if (response.code === 0) {
            this.$message({
              showClose: true,
              message: '修改成功',
              duration: 3000,
              type: 'success'
            });
            this.changePWDialogVisible = false;
          } else {
            this.$message({
              showClose: true,
              message: '修改失败',
              duration: 3000,
              type: 'error'
            });
          }
        })
      },
      handleClose(done) {
        this.code = '';
        this.passWord = '';
        this.codeBtn = '获取验证码';
        this.phone = '';
        this.email = '';
        done();
      },
      afterQRScan() {
          // const hash = window.location.hash.slice(1);
          // const hashObj = getQueryObject(hash);
          // const originUrl = window.location.origin;
          // history.replaceState({}, '', originUrl);
          // const codeMap = {
          //   wechat: 'code',
          //   tencent: 'code'
          // };
          // const codeName = hashObj[codeMap[this.auth_type]];
          // if (!codeName) {
          //   alert('第三方登录失败');
          // } else {
          //   this.$store.dispatch('LoginByThirdparty', codeName).then(() => {
          //     this.$router.push({ path: '/' });
          //   });
          // }
      }
    },
    created() {
        // window.addEventListener('hashchange', this.afterQRScan);
    },
    destroyed() {
        // window.removeEventListener('hashchange', this.afterQRScan);
    }
  }
</script>

<style rel="stylesheet/scss" lang="scss">
  @import "src/styles/mixin.scss";
  .tips {
    font-size: 14px;
    color: #fff;
    margin-bottom: 5px;
  }

  .login-container {
    @include relative;
    height: 100vh;
    background-color: #2d3a4b;
    input:-webkit-autofill {
      -webkit-box-shadow: 0 0 0px 1000px #293444 inset !important;
      -webkit-text-fill-color: #fff !important;
    }
    input {
      background: transparent;
      border: 0px;
      -webkit-appearance: none;
      border-radius: 0px;
      padding: 12px 5px 12px 15px;
      color: #eeeeee;
      height: 47px;
    }
    .el-input {
      display: inline-block;
      height: 47px;
      width: 85%;
    }
    .svg-container {
      padding: 6px 5px 6px 15px;
      color: #889aa4;
    }
    .title {
      font-size: 26px;
      font-weight: 400;
      color: #eeeeee;
      margin: 0px auto 40px auto;
      text-align: center;
      font-weight: bold;
    }
    .login-form {
      position: absolute;
      left: 0;
      right: 0;
      width: 400px;
      padding: 35px 35px 15px 35px;
      margin: 120px auto;
    }
    .el-form-item {
      border: 1px solid rgba(255, 255, 255, 0.1);
      background: rgba(0, 0, 0, 0.1);
      border-radius: 5px;
      color: #454545;
    }
    .forget-pwd {
      color: #fff;
    }
  }
</style>
