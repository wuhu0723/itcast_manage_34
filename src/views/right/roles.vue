<template>
  <div class="roles">
    <!-- 面包屑 -->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 表格 -->
    <el-table :data="roleList" style="width: 100%" border>
      <!-- type:expand:说明这一列后期可以展开 或  合并
      这列的template结构就是展开行的内容
      展开行可访问的属性与使用自定义列模板时的 Scoped slot 相同-->
      <el-table-column type="expand">
        <template slot-scope="scope">
          <!-- 准备进行嵌套循环生成展开行数据展示结构 -->
          <el-row
            v-for="first in scope.row.children"
            :key="first.id"
            style="margin-bottom:10px;border-bottom:1px dashed #ccc"
          >
            <el-col :span="4">
              <el-tag
                closable
                type="success"
                @close="delRightById(scope.row,first.id)"
              >{{first.authName}}</el-tag>
            </el-col>
            <el-col :span="20">
              <el-row v-for="second in first.children" :key="second.id" style="margin-bottom:10px">
                <el-col :span="4">
                  <el-tag
                    closable
                    type="info"
                    @close="delRightById(scope.row,second.id)"
                  >{{second.authName}}</el-tag>
                </el-col>
                <el-col :span="20">
                  <el-tag
                    closable
                    type="warning"
                    v-for="third in second.children"
                    :key="third.id"
                    style="margin:0px 10px 5px 0px"
                    @close="delRightById(scope.row,third.id)"
                  >{{third.authName}}</el-tag>
                </el-col>
              </el-row>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="24" v-show="scope.row.children.length == 0">没有任何的权限，请先分配！！</el-col>
          </el-row>
        </template>
      </el-table-column>
      <el-table-column type="index" width="50"></el-table-column>
      <el-table-column prop="roleName" label="角色名称"></el-table-column>
      <el-table-column prop="roleDesc" label="描述"></el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-tooltip class="item" effect="dark" content="编辑" placement="top">
            <el-button type="primary" icon="el-icon-edit"></el-button>
          </el-tooltip>
          <el-tooltip class="item" effect="dark" content="角色授权" placement="top">
            <el-button type="primary" icon="el-icon-d-caret" @click="showGrantDialog(scope.row)"></el-button>
          </el-tooltip>
          <el-tooltip class="item" effect="dark" content="删除" placement="top">
            <el-button type="primary" icon="el-icon-delete"></el-button>
          </el-tooltip>
        </template>
      </el-table-column>
    </el-table>
    <!-- 添加角色授权对话框 -->
    <el-dialog title="角色授权" :visible.sync="grantdialogFormVisible">
      <el-tree
        :data="rightList"
        show-checkbox
        node-key="id"
        :default-expand-all='true'
        :default-checked-keys="checkedArr"
        :props="defaultProps"
      ></el-tree>
      <div slot="footer" class="dialog-footer">
        <el-button @click="grantdialogFormVisible = false">取 消</el-button>
        <el-button type="primary">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import { getAllRolelist, delRightByRoleId } from '@/api/role_index.js'
import { getAllRightList } from '@/api/right_index.js'
export default {
  data () {
    return {
      grantdialogFormVisible: false,
      checkedArr: [],
      roleList: [],
      rightList: [],
      defaultProps: {
        children: 'children',
        label: 'authName'
      }
    }
  },
  methods: {
    // 打开授权角色对话框：
    async showGrantDialog (row) {
      this.grantdialogFormVisible = true
      // 进行所有权限数据的获取
      let res = await getAllRightList('tree')
      console.log(row)
      this.rightList = res.data.data
      // 获取当前角色的权限id
      // 先清空之前的数组中的存储的id
      this.checkedArr.length = 0
      if (row.children && row.children.length > 0) {
        row.children.forEach(first => {
          if (first.children && first.children.length > 0) {
            first.children.forEach(second => {
              if (second.children && second.children.length > 0) {
                second.children.forEach(third => {
                  // 添加id到数组
                  this.checkedArr.push(third.id)
                })
              }
            })
          }
        })
      }
    },
    // 删除指定角色的指定权限
    // roleId:角色id
    // rightId:权限id
    async delRightById (row, rightId) {
      let res = await delRightByRoleId(row.id, rightId)
      if (res.data.meta.status === 200) {
        this.$message({
          type: 'success',
          message: res.data.meta.msg
        })
        // console.log(res)
        // this.roleInit()
        // 我只想刷新当前展开行数据对象
        row.children = res.data.data
      }
    },
    // 角色数据的初始化
    async roleInit () {
      let res = await getAllRolelist()
      this.roleList = res.data.data
      // console.log(res)
    }
  },
  mounted () {
    this.roleInit()
  }
}
</script>
<style lang="less" scoped>
</style>
