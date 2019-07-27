<template>
  <div class="list">
    <!-- 面包屑 -->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 搜索区域 -->
    <div style="margin: 15px 0;">
      <el-input
        placeholder="请输入内容"
        v-model="userobj.query"
        class="input-with-select"
        style="width:300px;margin-right:10px"
        @keyup.enter.native="goodsInit"
      >
        <el-button slot="append" icon="el-icon-search" @click='goodsInit'></el-button>
      </el-input>
      <el-button type="success" plain @click='$router.push({name: "add"})'>添加商品</el-button>
    </div>
    <!-- 表格数据展示 -->
    <el-table :data="goodsList" style="width: 100%" border>
      <el-table-column type="index" width="50"></el-table-column>
      <el-table-column prop="goods_name" label="商品名称" width="520"></el-table-column>
      <el-table-column prop="goods_price" label="商品价格" width="180"></el-table-column>
      <el-table-column prop="goods_state" label="商品状态"></el-table-column>
      <el-table-column prop="goods_weight" label="商品重量"></el-table-column>
      <el-table-column prop="" label="创建时间" width="150">
          <template slot-scope='scope'>
              {{scope.row.add_time | timeFormat}}
          </template>
      </el-table-column>
      <el-table-column label="操作" width="280">
        <template slot-scope="scope">
          <el-tooltip class="item" effect="dark" content="编辑" placement="top">
            <el-button type="primary" icon="el-icon-edit"></el-button>
          </el-tooltip>
          <el-tooltip class="item" effect="dark" content="审核" placement="top">
            <el-button type="primary" icon="el-icon-d-caret"></el-button>
          </el-tooltip>
          <el-tooltip class="item" effect="dark" content="删除" placement="top">
            <el-button type="primary" icon="el-icon-delete"></el-button>
          </el-tooltip>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页区域 -->
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="userobj.pagenum"
      :page-sizes="[10, 20, 30, 40]"
      :page-size="userobj.pagesize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total"
    ></el-pagination>
  </div>
</template>
<script>
import { getAllGoodsList } from '@/api/goods_index.js'
export default {
  data () {
    return {
      goodsList: [],
      total: 100,
      userobj: {
        query: '',
        pagesize: 10,
        pagenum: 1
      }
    }
  },
  filters: {
    timeFormat (time) {
      time = new Date(time * 1000)
      return time.getFullYear() + '-' + (time.getMonth() + 1) + '-' + time.getDate()
    }
  },
  mounted () {
    this.goodsInit()
  },
  methods: {
    //   获取所有商品数据
    goodsInit () {
      getAllGoodsList(this.userobj)
        .then(res => {
          console.log(res)
          this.goodsList = res.data.data.goods
          this.total = res.data.data.total
        })
    },
    // 切换每页显示数量时触发
    handleSizeChange (val) {
      console.log(`每页 ${val} 条`)
      // 修改全局pagesize
      this.userobj.pagesize = val
      this.goodsInit()
    },
    // 切换当前页码时触发
    handleCurrentChange (val) {
      console.log(`当前页: ${val}`)
      // 修改全局的pagenum
      this.userobj.pagenum = val
      this.goodsInit()
    }
  }
}
</script>
<style lang="less" scoped>
</style>
