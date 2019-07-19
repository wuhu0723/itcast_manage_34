// 这个文件封装与axios相关的所有配置
import axios from 'axios'
// 设置基准路径
axios.defaults.baseURL = 'http://localhost:8888/api/private/v1/'

export default axios
