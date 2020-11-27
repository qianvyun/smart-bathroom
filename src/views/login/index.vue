<template>
  <div class="login-container">
    <el-form
      ref="loginForm"
      :model="loginForm"
      :rules="loginRules"
      class="login-form"
      autocomplete="on"
      label-position="left"
    >
      <div class="title-container">
        <h3 class="title"><div class="icon-warp"><img src="../../assets/images/login-icon.png"></div>智慧厕所</h3>
        <h3 class="sub-title">欢迎进入智能厕所系统!</h3>
      </div>

      <el-form-item label="账号" prop="username">
        <el-input
          ref="username"
          v-model="loginForm.username"
          placeholder="请输入账户"
          name="username"
          type="text"
          tabindex="1"
          autocomplete="on"
        />
      </el-form-item>

      <el-tooltip v-model="capsTooltip" content="Caps lock is On" placement="right" manual>
        <el-form-item label="密码" prop="password">
          <el-input
            :key="passwordType"
            ref="password"
            v-model="loginForm.password"
            :type="passwordType"
            placeholder="请输入密码"
            name="password"
            tabindex="2"
            autocomplete="on"
            @keyup.native="checkCapslock"
            @blur="capsTooltip = false"
            @keyup.enter.native="handleLogin"
          />
        </el-form-item>
      </el-tooltip>

      <el-form-item label="验证码" prop="captcha">
        <el-input
          ref="captcha"
          v-model="loginForm.captcha"
          placeholder="请输入验证码"
          name="captcha"
          type="text"
          tabindex="3"
          autocomplete="off"
          style="float: left; width: 180px;"
        />
        <div class="captcha_code"><img ref="code" :src="captchaUrl" @click="changeCode"></div>
        <!--<img src="http://101.132.193.151:8887/kdzn/toilet/getcaptcha"/>-->
      </el-form-item>

      <el-form-item prop="rememberPassword ">
        <el-checkbox ref="rememberPassword" v-model="loginForm.checked">记住密码</el-checkbox>
      </el-form-item>
      <el-button
        :loading="loading"
        type="primary"
        style="width:100%;"
        @click.native.prevent="handleLogin"
      >登 录</el-button>
    </el-form>
    <ul class="date-warp clear">
      <li class="day-warp">
        <div class="num year">{{ nowDate.year }}</div>
        <div class="type">Year</div>
      </li>
      <li class="day-warp">
        <div class="num">{{ nowDate.month }}</div>
        <div class="type">Month</div>
      </li>
      <li class="day-warp">
        <div class="num">{{ nowDate.date }}</div>
        <div class="type">Day</div>
      </li>
    </ul>
  </div>
</template>

<script>
import { validUsername } from '@/utils/validate';

export default {
  name: 'Login',
  // components: { SocialSign },
  data() {
    const validateUsername = (rule, value, callback) => {
      if (!validUsername(value)) {
        callback(new Error('请输入用户名'));
      } else {
        callback();
      }
    };
    const validatePassword = (rule, value, callback) => {
      if (value.length < 5) {
        callback(new Error('请输入大于6位的密码'));
      } else {
        callback();
      }
    };
    const validateCaptcha = (rule, value, callback) => {
      if (value.length === 5) {
        callback();
      } else {
        callback(new Error('请输入5位的验证码'));
      }
    };
    return {
      loginForm: {
        username: 'admin',
        password: 'admin',
        captcha: '',
        checked: true
      },
      loginRules: {
        username: [
          { required: true, trigger: 'blur', validator: validateUsername }
        ],
        password: [
          { required: true, trigger: 'blur', validator: validatePassword }
        ],
        captcha: [
          { required: true, trigger: 'blur', validator: validateCaptcha }
        ]
      },
      passwordType: 'password',
      captchaUrl: '',
      capsTooltip: false,
      loading: false,
      showDialog: false,
      redirect: undefined,
      nowDate: {
        year: 2020,
        month: 9,
        date: 1
      },
      otherQuery: {}
    };
  },
  watch: {
    $route: {
      handler: function(route) {
        const query = route.query;
        if (query) {
          this.redirect = query.redirect;
          this.otherQuery = this.getOtherQuery(query);
        }
      },
      immediate: true
    }
  },
  created() {
    this.getDate();
    this.changeCode()
    // window.addEventListener('storage', this.afterQRScan)
  },
  mounted() {
    if (this.loginForm.username === '') {
      this.$refs.username.focus();
    } else if (this.loginForm.password === '') {
      this.$refs.password.focus();
    }
  },
  destroyed() {
    // window.removeEventListener('storage', this.afterQRScan)
  },
  methods: {
    checkCapslock(e) {
      const { key } = e;
      this.capsTooltip = key && key.length === 1 && key >= 'A' && key <= 'Z';
    },
    showPwd() {
      if (this.passwordType === 'password') {
        this.passwordType = '';
      } else {
        this.passwordType = 'password';
      }
      this.$nextTick(() => {
        this.$refs.password.focus();
      });
    },
    changeCode() {
      const captchaKey = Math.random().toString(36).substring(2);
      this.captchaUrl = `http://101.132.193.151:8887/kdzn/toilet/getcaptcha??code=${captchaKey}`;
    },
    handleLogin() {
      this.$refs.loginForm.validate(valid => {
        if (valid) {
          this.loading = true;
          this.$store
            .dispatch('user/login', this.loginForm)
            .then(() => {
              this.$router.push({
                path: this.redirect || '/',
                query: this.otherQuery
              });
              this.loading = false;
            })
            .catch(() => {
              this.loading = false;
            });
        } else {
          console.log('error submit!!');
          return false;
        }
      });
    },
    getOtherQuery(query) {
      return Object.keys(query).reduce((acc, cur) => {
        if (cur !== 'redirect') {
          acc[cur] = query[cur];
        }
        return acc;
      }, {});
    },
    getDate() {
      const currentDate = new Date();
      this.nowDate.year = currentDate.getFullYear();
      this.nowDate.month = currentDate.getMonth() + 1;
      this.nowDate.date = currentDate.getDate();
    }
  }
};
</script>

<style lang="scss">
@import "~@/styles/mixin.scss";
/* 修复input 背景不协调 和光标变色 */
/* Detail see https://github.com/PanJiaChen/vue-element-admin/pull/927 */
$cursor: rgba(99, 110, 149, 1);

@supports (-webkit-mask: none) and (not (cater-color: $cursor)) {
  .login-container .el-input input {
    color: $cursor;
  }
}

.login-container {
  .el-form-item{
    margin-bottom: 15px;
    .el-form-item__label{
      &:before{
        content: '';
      }
    }
  }
  .el-input {
    .el-input__inner{
      background: rgba(250, 252, 254, 1);
      border-color: rgba(151, 160, 195, 1);
      height: 42px;
      line-height: 42px;
      font-size: 16px;
      -webkit-appearance: none;
      padding: 0 13px 0 13px;
      border-radius: 10px;
      color: $cursor;
      caret-color: $cursor;
    }
  }
  .el-checkbox{
    padding: 8px 0;
    font-size: 16px;
    color: rgba(36, 47, 87, 1);
  }
  .el-checkbox__inner{
    width: 24px;
    height: 24px;
    border-radius: 8px;
    border-color: rgba(151, 160, 195, 1);
    &:after{
      left: 8px;
      top: 5px;
    }
  }
  .el-checkbox__input.is-checked + .el-checkbox__label{
    color: rgba(36, 47, 87, 1);
  }
  .el-checkbox__input.is-checked .el-checkbox__inner{
    background: rgba(182, 145, 251, 1);
    border-color: rgba(182, 145, 251, 1);
  }
  .el-form-item.is-required:not(.is-no-asterisk){
    &> .el-form-item__label,.el-form-item__label-wrap > .el-form-item__label {
      font-family: NotoSansCJKRegular;
      letter-spacing: 2.5px;
      width: 100%;
      height: 20px;
      line-height: 20px;
      font-size: 14px;
      font-weight: lighter;
      margin-bottom: 15px;
      color: rgba(151, 160, 195, .9);
      &:before{
        content: '';
        margin-left: 7px;
      }
    }
  }
  .el-button--primary{
    font-weight: bold;
    font-size: 16px;
    background: -moz-linear-gradient(
        top,
        #BA95FB 0%,
        #845CF6 100%
    );
    background: -webkit-gradient(
        linear,
        left top,
        left bottom,
        color-stop(0% #BA95FB),
        color-stop(100%, #845CF6)
    );
    background: -webkit-linear-gradient(
        top,
        #BA95FB 0%,
        #845CF6 100%
    );
    background: -o-linear-gradient(
        top,
        #BA95FB 0%,
        #845CF6 100%
    );
    background: -ms-linear-gradient(
        top,
        #BA95FB 0%,
        #845CF6 100%
    );
    background: linear-gradient(
        to bottom,
        #BA95FB 0%,
        #845CF6 100%
    );
    border: none;
    height: 42px;
  }

}

</style>

<style lang="scss" scoped>
@import "~@/styles/mixin.scss";
$bg: #fff;
$dark_gray: #889aa4;
$light_gray: #eee;

.login-container {
  width: 100vw;
  height: 100vh;
  background: url("../../assets/images/login-bg.png") no-repeat;
  background-position: top right;
  background-size: auto 100%;
  background-color: $bg;
  overflow: hidden;
  font-family: NotoSansCJKRegular;
  position: relative;

  .login-form {
    position: relative;
    left: vw(400);
    top: vh(272);
    width: 300px;
    overflow: hidden;
  }

  .title-container {
    margin-bottom: 36px;
    .title {
      letter-spacing: 1px;
      /*font-family: HYRuiZhiW;*/
      height: 34px;
      line-height: 34px;
      font-size: 24px;
      color: #835BF5;
      margin-bottom: 3px;
      .icon-warp{
        display: inline-block;
        padding-right: 13px;
        height: 34px;
        vertical-align: middle;
        img{
          width: 28px;
        }
      }
    }
    .sub-title {
      letter-spacing: 1px;
      /*font-family: HYRuiZhiW;*/
      height: 36px;
      line-height: 36px;
      font-size: 26px;
      color: #242F57;
    }
  }
  .captcha_code {
    display: inline-block;
    width: 100px;
    margin-left: 20px;
    img{
      width: 100%;
      vertical-align: bottom;
    }
  }
  .date-warp{
    position: absolute;
    right: vw(202);
    bottom: vh(107);
    .day-warp{
      float: left;
      margin-left: 55px;
      width: 121px;
      height: 121px;
      border-radius: 8px;
      border: 1px solid #FFFFFF;
      text-align: center;
      padding: 8px;
      /*font-family: HYRuiZhiW;*/
      color: #FFFFFF;
      .num{
        height: 74px;
        line-height: 74px;
        font-size: 50px;
        &.year{
          font-size: 40px;
        }
      }
      .type{
        /*font-family: HYRuiZhiW;*/
        height: 32px;
        line-height: 32px;
        font-size: 24px;
      }
    }

  }
}
</style>
