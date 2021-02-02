<template>
  <view class="index">
    <NumberDisplay/>
    <NumberSubmit/>
    <!-- <FrontTool /> -->
    <tool />
    <view @tap="go">点我请求</view>
  </view>
</template>

<script>
import NumberDisplay from '../../components/NumberDisplay.vue'
import NumberSubmit from '../../components/NumberSubmit.vue'
import FrontTool from '../../components/front-tool'

export default {
  name: 'Index',
  components: {
    NumberDisplay,
    NumberSubmit,
    FrontTool
  },
  mounted(){
    console.log('121');
    this.re()
  },
  methods:{
    go(){
      this.re()
    },
    re(){
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
