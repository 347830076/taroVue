<!--前端工具栏-->
<style lang="scss">
.c-mask-box {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 9999;
}
.c-mask-box .mask {
  position: fixed;
  width: 100%;
  height: 100%;
  opacity: 0.6;
  background-color: #000000;
}
.c-mask-box .content-box {
  position: fixed;
  display: flex;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 999;
  align-items: center;
  justify-content: center;
}
.c-front-tool {
  display: inline-block;
  position: fixed;
  bottom: 90px;
  right: 20px;
  z-index: 9999;
}
.c-front-tool .control-box {
  padding: 20px 0;
  width: 450px;
  height: 90%;
  border-radius: 4px;
  background-color: #eeeeee;
}
.c-front-tool .control-box > view>view {
  margin: 0 auto 10px;
  position: relative;
  width: 300px;
  padding: 14px 0;
  color: #FFFFFF;
  font-size: 20px;
  font-weight: bold;
  text-align: center;
  border-radius: 4px;
  background-color: #3D8AC7;
}
.c-front-tool .control-box > view>view:nth-last-child(1) {
  background-color: #DC5350;
}
.c-front-tool .control-box > view>view:nth-last-child(2) {
  background-color: #F66F2C;
}
.c-front-tool .control-box > view>view:nth-last-child(1) {
  background-color: #DC5350;
}
.c-front-tool .btn-entrance {
  position: relative;
  border-radius: 4px;
  padding: 10px 20px;
  font-size: 20px;
  font-weight: bold;
  color: #FFFFFF;
  opacity: 0.7;
  background-color: #3D8AC7;
}
.c-front-tool .btn-entrance i {
  position: absolute;
  top: -8px;
  right: -8px;
  height: 20px;
  width: 20px;
  border-radius: 50%;
  border: 1px solid lightgray;
  background-color: #FFFFFF;
  background-repeat: round;
  background-image: url(http://www.luckly-mjw.cn/baseSource/icon-cancel.png);
}
.c-tips {
  position: fixed;
  padding: 0 14px;
  top: -50px;
  left: 50%;
  height: 40px;
  color: #69C6D2;
  font-size: 20px;
  line-height: 38px;
  border-radius: 2px;
  display: inline-block;
  transition: 0.5s all;
  transform: translate(-50%);
  background-color: #275E71;
  border: 2px solid #57C4CE;
}
.c-tips--show {
  top: 10px;
}
</style>

<template>
  <view class="c-front-tool" v-show="!isClose" v-if="runtimeEnv !== 'production'">
    <view class="c-mask-box" @dragstart="false" v-if="showBox">
      <view class="mask"></view>
      <view class="content-box" @tap.self="showBox=false">
        <view class="control-box">
          <view>
            <view @tap="reportDate"> 数据上报 </view>
            <!-- <view @tap="clearStorage"> 清除缓存数据 </view> -->
            <view v-for="(item, index) in menu"
                @tap="item.callback"
                :key="index"
            > {{item.name}} </view>
            <view @tap="showBox=false"> 关闭弹窗 </view>
            <view @tap="isClose=true"> 关闭工具 </view>
          </view>
        </view>
      </view>
    </view>
    <view class="c-tips" :class="{'c-tips--show':showTips}">{{tips}}</view>
    <view class="btn-entrance" @tap="showBox=true;">{{runtimeEnv | runtimeName}}环境</view>
  </view>
</template>

<script>
/* eslint-disable */
import Taro, { getCurrentInstance } from "@tarojs/taro";
import AV from 'leancloud-storage/dist/av-weapp.js';
export default {
  props: {
    menu: Array,
    useInProd: Boolean, // 在生产环境也使用
    ajaxHook: Function, // 外部请求检测钩子
  },

  data() {
    return {
      tips: '', // 提示文案
      tipsTimeout: -1, // 提示文案重置计时器
      browserType: '', // 浏览器类型
      runtimeEnv: 'development', // 当前运行环境
      ajaxList: [], // ajax请求数组
      globalData: {}, // 自定义全局数据，每个上报的数据都有，用于保存用户名等固定信息
      customData: {}, // 自定义数据
      showTips: false, // 是否显示控制面板
      showBox: false, // 是否显示控制面板
      isClose: false, // 是否关闭工具
    }
  },

  filters: {
    runtimeName(value) {
      return {
        development: '本地',
        dev: '开发',
        test: '测试',
        pre: '预发布',
        production: '生产',
      }[value]
    },
  },

  watch: {
    // 刷新组件，即在路由变更时，清空记录内容
    $route() {
      window.ftLogText = ''
      this.ajaxList = []
      this.clearCustomData() // 清空自定义数据
    },

    // 打印提示信息
    tips(newValue) {
      this.runtimeEnv = this.getRuntimeEnv()
      if (this.runtimeEnv !== 'production') { // 非生成环境，打印数据
        clearTimeout(this.tipsTimeout)
        if (newValue) {
          this.showTips = true
          this.tipsTimeout = setTimeout(() => {
            this.showTips = false
          }, 2000)
        }
      } else { // 生成环境，打印数据
        console.log(newValue)
        window.ftLogText += `${newValue}\r\n`
      }
    },
  },

  created() {
    this.runtimeEnv = this.getRuntimeEnv()
    if (this.runtimeEnv !== 'production' || this.useInProd) {
      this.init()
    }
  },

  methods: {
    // 初始化，重写AJAX，往全局添加函数
    init() {
      AV.init({
        appId: 'wG80ABRLiltFyle1Og4w2t17-gzGzoHsz',
        appKey: 'teVOQOS5KxE0JwJsul9vWEPO',
        serverURL: "https://wg80abrl.lc-cn-n1-shared.com"
      })
      this.logInterceptor()
    },
    // 拦截器
    logInterceptor(){
      const that = this

      const interceptor = function (chain) {
      const requestParams = chain.requestParams
      const { method, data, url } = requestParams

      console.log(`http ${method || 'GET'} --> ${url} data: `, data)
      const ajaxData = {
       request: {
          method: method || 'GET',
          data: data || {},
          url
       }
      }
      return chain.proceed(requestParams)
        .then(res => {
          console.log(`http <-- ${url} result:`, res)
          ajaxData.response = res
          that.ajaxList.push(ajaxData)
          return res
        })
      }
      Taro.addInterceptor(interceptor)
      Taro.request({ url: 'http://api.wanggege.cn/' })
      Taro.request({ url: 'http://api.wanggege.cn/' })
    },
    // 解析参数
    getParams(url, key) {
      let params = {}
      url = decodeURIComponent(url.replace(/%/g, '%25'))
      url.replace(/[?|&](\w+)=([^&^?]*)/g, (matchStr, $1, $2) => {
        params[$1] = $2
      })
      return key ? params[key] : params
    },

    // 添加全局数据，在每个上报的数据中都有
    addGlobalData(data) {
      this.globalData = Object.assign(this.globalData, data)
    },

    // 添加全局数据，在每个上报的数据中都有
    clearGlobalData() {
      this.globalData = {}
    },

    // 添加自定义数据
    addCustomData(data) {
      this.customData = Object.assign(this.customData, data)
    },

    // 添加自定义数据
    clearCustomData() {
      this.customData = {}
    },

    // 上报数据
    reportDate() {
      const bugClass = AV.Object.extend('bug')
      let bug = new bugClass()
      console.log('当前环境', this.runtimeEnv);
      console.log('页面路径', getCurrentInstance().router.path);

      bug.set('env', this.runtimeEnv) // 当前环境
      bug.set('hostEnv', '小程序') // 运行的浏览器
      bug.set('pageURL', getCurrentInstance().router.path) // 页面路径
      bug.set('params', getCurrentInstance().router.params) // 页面参数

      const systemInfo = Taro.getSystemInfoSync()
      console.log('系统信息', systemInfo);

      bug.set('useragent', JSON.stringify(systemInfo)) // 浏览器信息
      
      bug.set('ajax', this.ajaxList) // 接口信息
      bug.set('custom', Object.assign({}, this.globalData, this.customData)) // 自定义数据
      bug.save().then((res) => {
        this.showBox = false
        this.tips = `数据上报成功，信息ID为：${res.id}`
      }, function (error) {
        console.log(error);
        alert(JSON.stringify(error));
      });
    },

    // 获取运行环境
    getRuntimeEnv() {
      return process.env.NODE_ENV
    },
  },
}
</script>
