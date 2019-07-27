// 这个文件用来处理所有与商品分类相关的操作
// 1.引入axios
import axios from '@/utils/myaxios.js'

// 获取所有分类参数
export const getAllCatePramsList = (id, sel) => {
  return axios({
    url: `categories/${id}/attributes`,
    params: { sel }
  })
}
