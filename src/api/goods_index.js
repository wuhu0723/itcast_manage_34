// 这个文件用来处理所有与商品相关的操作
// 1.引入axios
import axios from '@/utils/myaxios.js'

// 获取所有商品数据
export const getAllGoodsList = (params) => {
  return axios({
    url: 'goods',
    params
  })
}

// 实现商品的添加
export const addGoods = (data) => {
  return axios({
    url: 'goods',
    method: 'post',
    data
  })
}
