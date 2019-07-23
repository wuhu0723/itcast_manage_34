// 这个文件用来处理所有与角色相关的操作
// 1.引入axios
import axios from '@/utils/myaxios.js'

// 获取所有角色数据
export const getAllRolelist = () => {
  return axios({
    url: 'roles'
  })
}

// 删除指定角色的指定权限
export const delRightByRoleId = (roleId, rightId) => {
  return axios({
    url: `roles/${roleId}/rights/${rightId}`,
    method: 'delete'
  })
}
