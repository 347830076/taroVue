
// 浅拷贝一个对象
let _extends = Object.assign || function (target) {
  for (let i = 1; i < arguments.length; i++) {
    let source = arguments[i];
    for (let key in source) {
      if (Object.prototype.hasOwnProperty.call(source, key)) {
        target[key] = source[key];
      }
    }
  }
  return target;
};

export default function () {
    // 判断是否传入参数
    let interceptors = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

    // 复制一份wx对象出来备用
    let oldWx = wx;
    // 复制一份wx对象出来改写request请求，加上请求前，请求后的回调
    let newWx = _extends({}, wx);

    newWx.request = (params) => {
        // 请求前的参数拦截
        interceptors.request &&  interceptors.request(params)

        // 复制多一份微信的原生参数对象，不然直接使用会造成死循环
        let newParms = _extends({}, params)

        // 改写complete回调函数
        Object.assign(newParms, {
            complete: function complete(res){
                // 请求后的结果拦截
                interceptors.response &&  interceptors.response(res)
                params.complete && params.complete(res)
            }
        })

        // 再用备份的wx对象, 执行改写后的参数对象，这样就可以不影响原生小程序的wx.request使用，而且我们也做了拦截器对象interceptors
        oldWx.request(newParms)
    }
    wx = newWx
}
