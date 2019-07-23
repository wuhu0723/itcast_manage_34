// 这个文件用来处理所有与权限相关的操作
// 1.引入axios
import axios from '@/utils/myaxios.js'

// 获取所有权限数据
export const getAllRightList = (type) => {
  return axios({
    url: `rights/${type}`
  })
}
