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
          <el-row v-for="first in scope.row.children" :key="first.id" style="margin-bottom:10px;border-bottom:1px dashed #ccc">
            <el-col :span="4">
              <el-tag closable type="success">{{first.authName}}</el-tag>
            </el-col>
            <el-col :span="20">
              <el-row v-for='second in first.children' :key='second.id'  style="margin-bottom:10px">
                <el-col :span='4'>
                  <el-tag closable type="info">{{second.authName}}</el-tag>
                </el-col>
                <el-col :span='20'>
                  <el-tag closable type="warning" v-for='third in second.children' :key='third.id'  style="margin:0px 10px 5px 0px">{{third.authName}}</el-tag>
                </el-col>
              </el-row>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span='24' v-show='scope.row.children.length == 0'>没有任何的权限，请先分配！！</el-col>
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
            <el-button type="primary" icon="el-icon-d-caret"></el-button>
          </el-tooltip>
          <el-tooltip class="item" effect="dark" content="删除" placement="top">
            <el-button type="primary" icon="el-icon-delete"></el-button>
          </el-tooltip>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>
<script>
import { getAllRolelist } from '@/api/role_index.js'
export default {
  data () {
    return {
      roleList: []
    }
  },
  methods: {
    // 角色数据的初始化
    async roleInit () {
      let res = await getAllRolelist()
      this.roleList = res.data.data
      console.log(res)
    }
  },
  mounted () {
    this.roleInit()
  }
}
</script>
<style lang="less" scoped>
</style>
