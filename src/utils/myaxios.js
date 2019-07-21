// 这个文件封装与axios相关的所有配置
import axios from 'axios'
// 设置基准路径
axios.defaults.baseURL = 'http://localhost:8888/api/private/v1/'

// 添加请求拦截器
axios.interceptors.request.use(function (config) {
  // 在发送请求之前做些什么
  // 做点什么：通过请求头的方式传递token数据，并且传递时的键必须设置为Authorization
//   1.获取token
  var token = localStorage.getItem('itcast_manage_34_token')
  if (token) {
    //   2.通过请求头的方式设置token的传递,通过config获取到请求头
    config.headers['Authorization'] = token
  }

  return config
}, function (error) {
  // 对请求错误做些什么
  return Promise.reject(error)
})

export default axios
