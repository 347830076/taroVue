import AV from 'leancloud-storage/dist/av-weapp.js'
import wxApiInterceptors from './wxApiInterceptors'
import wxResetRequest from './wxResetRequest'
const serverURL = "https://wg80abrl.lc-cn-n1-shared.com"
// 请求一条记录信息
let ajaxData = {}
// 多条请求记录信息数组
let ajaxList = []
wxResetRequest({
  request(req){
    console.log('wxResetRequest req', req);
    if(req.url.indexOf(serverURL) === -1){
      ajaxData['request'] = req
      // flag = true
    }
  },
  response(res){
    console.log('wxResetRequest res', res)
      ajaxData['response'] = res
      ajaxList.push(ajaxData)
  }
})
Component({
  data: {
      tips: '', // 提示文案
      tipsTimeout: -1, // 提示文案重置计时器
      browserType: '', // 浏览器类型
      runtimeEnv: '开发', // 当前运行环境
      ajaxList: [], // ajax请求数组
      globalData: {}, // 自定义全局数据，每个上报的数据都有，用于保存用户名等固定信息
      customData: {}, // 自定义数据
      showTips: false, // 是否显示控制面板
      showBox: false, // 是否显示控制面板
      isClose: false, // 是否关闭工具
      ajaxData: {
        request: {},
        response: {}
      }
  },
  options: {
    styleIsolation: 'isolated'
  },
  properties: { /* ... */ },
  // 组件生命周期函数-在组件实例进入页面节点树时执行
  created: function () { 
    console.log('attached');
    this.runtimeEnv = this.getRuntimeEnv()
    if (this.runtimeEnv !== 'production' || this.useInProd) {
      this.init()
    }
  },
  // 组件生命周期函数-在组件布局完成后执行
  ready: function() { 
    // console.log('ready');
  },
  methods: {
    // 初始化，重写AJAX，往全局添加函数
    async init() {
      // const serverURL = "https://wg80abrl.lc-cn-n1-shared.com"
      // const that = this
      // await wxApiInterceptors({
      //   request: {
      //       request(params) {
      //         console.log('request,', params);
      //         if(params.url.indexOf(serverURL) === -1){
      //           console.log(that.data.ajaxData);
      //           that.setData({
      //             ajaxData: {
      //               request: params
      //             }
      //           })
      //           flag = true
      //         }
      //         return params;
      //       },
      //       response(res){
      //         console.log('response,', res);
      //         if(flag){
      //           const ajaxData = that.data.ajaxData;
      //           ajaxData.response = res

      //           const arr = that.data.ajaxList
      //           arr.push(ajaxData)
      //           console.log('arr', arr);
      //           that.setData({
      //               ajaxList: arr
      //           })
      //         }
              
      //         return res;
      //       }
      //   },
      // });
      AV.init({
        appId: 'wG80ABRLiltFyle1Og4w2t17-gzGzoHsz',
        appKey: 'teVOQOS5KxE0JwJsul9vWEPO',
        serverURL
      })
    },

    // 切换显示弹窗
    showBoxFun(){
        console.log(this.data.showBox);
        this.setData({
            showBox: !this.data.showBox
        })
    },
    
    // 关闭工具
    isCloseFun(){
        this.setData({
            isClose: !this.data.isClose
        })
    },
    // 获取运行环境
    getRuntimeEnv() {
        let obj = {
          development: '开发',
          production: '生产'
        }
        return obj[process.env.NODE_ENV]
    },
    // 上报数据
    reportDate(){
      const that = this;
      if(!ajaxList.length){
        wx.showToast({
          title: '没有请求过接口',
          icon: 'none',
          duration: 2000
        })
        
        return;
      }
      const bugClass = AV.Object.extend('bug')
      let bug = new bugClass()
      console.log('当前环境', this.runtimeEnv);
      // 获取当前页面信息
      let pages = getCurrentPages();
      let currPage = pages[pages.length - 1];
      console.log(currPage)  
      // console.log('页面路径', getCurrentInstance().router.path);

      bug.set('env', this.runtimeEnv) // 当前环境
      bug.set('hostEnv', '小程序') // 运行的浏览器
      console.log('页面路径', currPage.__route__);
      bug.set('pageURL', currPage.__route__) // 页面路径
      bug.set('params', currPage.options) // 页面参数

      const systemInfo = wx.getSystemInfoSync()
      console.log('系统信息', systemInfo);

      bug.set('useragent', JSON.stringify(systemInfo)) // 浏览器信息
      console.log('ajax', ajaxList);
      bug.set('ajax', ajaxList) // 接口信息
      bug.save().then((res) => {
        that.setData({
          showBox: false,
          showTips: true,
          tips: `数据上报成功，信息ID为：${res.id}`
        })
        ajaxList = []
      }, function (error) {
        console.log(error);
        wx.showToast({
          title: error,
          icon: 'none',
          duration: 2000
        })
      });
    },
    // 空函数
    emptyFun(){}
  }
})