<template>
  <view class="index">
    <NumberDisplay/>
    <NumberSubmit/>
    <tool :menu="menu" />
    <view @tap="myClick">点我请求</view>
    <view @tap="goto">跳转页面</view>
  </view>
</template>

<script>
import Taro from '@tarojs/taro'
import NumberDisplay from '../../components/NumberDisplay.vue'
import NumberSubmit from '../../components/NumberSubmit.vue'

export default {
  name: 'Index',
  components: {
    NumberDisplay,
    NumberSubmit,
  },
  data(){
    return {
      menu: [{
        name: '自定义菜单',
        callback: function (){
          console.log('自定义菜单');
        }
      }]
    }
  },
  mounted(){
    this.request()
    wx.addCustomData({
      name: 'addCustomData'
    })
  },
  methods:{
    myClick(){
      this.request()
    },
    goto(){
       Taro.navigateTo({ url: '/pages/home/index' })
    },
    request(){
      wx.request({
          url: 'http://api.wanggege.cn', //仅为示例，并非真实的接口地址
          data: {
          },
          header: {
            'content-type': 'application/json', // 默认值
            'token': '1234'
          },
          success (res) {
            console.log('首页', res)
          },
          complete(res){
            console.log('complete',res);
          }
        })
    }
  }
}
</script>

<style>
.index {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
