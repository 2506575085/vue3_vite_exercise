import axios from 'axios'
axios.defaults.headers['Content-Type'] = 'application/json;charset=utf-8'

let whiteList = [
  '/dlkjsdljla',
]
// 创建axios实例
const service = axios.create({
  // axios中请求配置有baseURL选项，表示请求URL公共部分
  baseURL: import.meta.env.VITE_API_BASEPATH,
  // 超时
  timeout: 60000
})
// request拦截器
service.interceptors.request.use(
  (config) => {
    return config
  },
  (error) => {
    Promise.reject(error)
  }
)


let reloginFlag = false
// 响应拦截器
service.interceptors.response.use(
  (res: any) => {
    // 未设置状态码则默认成功状态
    const code = res.data.code || 200
    // 获取错误信息
    const msg = res.data.msg
    if (code === 10006) {
      if (whiteList.indexOf(res.config.url) !== -1) {
        return Promise.reject(res.data)
      }
      if (!reloginFlag) {
        reloginFlag = true
        return Promise.reject(res.data)
      } else {
        reloginFlag = false
        return Promise.reject(res.data)
      }
    } else if (code === 500) {
      return Promise.reject(new Error(msg))
    } else if (code !== 200) {
      return Promise.reject('error')
    } else {
      return res.data
    }
  },
  (error) => {
    let { message } = error
    if (message == 'Network Error') {
      message = '后端接口连接异常'
    } else if (message.includes('timeout')) {
      message = '系统接口请求超时'
    } else if (message.includes('Request failed with status code')) {
      message = '系统接口' + message.substr(message.length - 3) + '异常'
    }
    return Promise.reject(error)
  }
)

export default service
