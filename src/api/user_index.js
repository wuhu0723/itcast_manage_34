// 这个文件用来处理所有与用户相关的操作
// 1.引入axios
import axios from '@/utils/myaxios.js'

// 登陆
export const login = (data) => {
  // axios({)返回了一个promise对象
  return axios({
    //   http://localhost:8888/api/private/v1/login
    //   请求路由路径
    url: 'login',
    // 请求方式,默认为get
    method: 'post',
    // post方式所传递的数据
    data
  })
}

// 获取所有用户数据
export const getAllUserList = (params) => {
  return axios({
    url: 'users',
    params
  })
}

// 添加用户
export const addUser = (data) => {
  return axios({
    url: 'users',
    method: 'post',
    data
  })
}

// 编辑用户
export const editUser = (data) => {
  return axios({
    url: `users/${data.id}`,
    method: 'put',
    data: { email: data.email, mobile: data.mobile }
  })
}

// 根据id删除用户
export const delUserById = (id) => {
  return axios({
    url: `users/${id}`,
    method: 'delete'
  })
}
