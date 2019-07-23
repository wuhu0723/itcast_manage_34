// 这个文件用来处理所有与角色相关的操作
// 1.引入axios
import axios from '@/utils/myaxios.js'

// 获取所有角色数据
export const getAllRolelist = () => {
  return axios({
    url: 'roles'
  })
}
