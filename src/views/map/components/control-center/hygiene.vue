<template>
  <div class="hygiene-warp">
    <div class="hygiene-header">
      <h5 class="title">厕所评价</h5>
    </div>
    <div class="hygiene-box">
      <div class="star-list">
        <ul>
          <li>
            <div class="describe">卫生环境</div>
            <div class="stars">
              <i class="icon iconfont iconstar" :class="{light:item}" v-for="item of stars.environmental"/>
            </div>
          </li>
          <li>
            <div class="describe">管路服务</div>
            <div class="stars">
              <i class="icon iconfont iconstar" :class="{light:item}" v-for="item of stars.service"/>
            </div>
          </li>
          <li>
            <div class="describe">设施设备</div>
            <div class="stars">
              <i class="icon iconfont iconstar" :class="{light:item}" v-for="item of stars.facilities"/>
            </div>
          </li>
        </ul>
      </div>
      <div class="cleaner-msg clear">
        <div class="pic"><img src="" alt=""></div>
        <div class="msg">
          <h6>当前保洁员</h6>
          <p><span>姓名：</span>张三</p>
          <p><span>状态：</span>在岗</p>
          <p><span>评价等级：</span>优</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Hygiene',
  props: {
    hygieneData: {
      type: Object,
      // required: true
    }
  },
  data() {
    return {
      num: 3,
      stars: {
        environmental: [true, true, true, false, false],
        service: [true, true, true, true, true],
        facilities: [true, true, true, false, false]
      }
    }
  }
}
</script>

<style lang="scss" scoped>
@import "~@/styles/mixin.scss";
.hygiene-warp{
  padding: 0 vw(30);
  h5{
    height: vh(44);
    line-height: vh(44);
    font-size: vw(18);
    font-family: FZZCHJW;
    font-weight: lighter;
  }
  .hygiene-box{
    .star-list ul{
      border: 1px solid rgba(42,107,255,.5);
      border-radius: 5px;
      li{
        height: vh(32);
        line-height: vh(32);
        font-size: 0;
        text-align: center;
        border-bottom: 1px solid rgba(42,107,255,.5);
        &:last-child{
          border-bottom: none;
        }
        div{
          display: inline-block;
          font-size: vh(14);
          &.describe{
            width: vw(105);
            border-right: 1px solid rgba(42,107,255,.5);
          }
          &.stars{
            width: vw(215);
            i{
              vertical-align: middle;
              margin: 0 vw(8);
              font-size: vh(18);
              color: #768caa;
              &.light{
                color: #f0c26b;
              }
            }
          }
        }
      }
    }
    .cleaner-msg{
      padding-top: vh(16);
      .pic{
        float: right;
        margin-right: vw(40);
        border-radius: 5px;
        overflow: hidden;
        width: vh(95);
        height: vh(95);
        background: #13366a;
      }
      .msg{
        color: #d7f2ff;
        font-size: vh(14);
        h6{
          position: relative;
          padding-left: vw(10);
          height: vh(16);
          line-height: vh(16);
          font-weight: normal;
          margin-bottom: vh(10);
          &:before{
            content: '';
            width: vw(3);
            height: vh(14);
            position: absolute;
            top: 1px;
            left: 0;
            background: #3fe9e6;
            border-radius: 3px;
          }
        }
        p{
          height: vh(24);
          line-height: vh(24);
          vertical-align: middle;
          span{
            display: inline-block;
            width: vw(84);
            margin-right: vw(8);
            text-align: right;
          }
        }
      }
    }
  }
}
</style>
