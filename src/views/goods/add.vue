<template>
  <div class="add">
    <!-- 面包屑 -->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品添加</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 添加步骤条  active:需要一个number -->
    <el-steps :active="activeName-0" finish-status="success">
      <el-step title="步骤 1"></el-step>
      <el-step title="步骤 2"></el-step>
      <el-step title="步骤 3"></el-step>
      <el-step title="步骤 4"></el-step>
      <el-step title="步骤 5"></el-step>
    </el-steps>
    <!-- 添加标签页 -->
    <el-form :model="addForm" label-width="120px" ref="addForm">
      <el-tabs
        v-model="activeName"
        @tab-click="handleClick"
        tab-position="left"
        :before-leave='beforeLeave'
        style="margin-top:20px"
      >
        <el-tab-pane label="基本信息" name="0">
          <el-form-item label="商品名称">
            <el-input v-model="addForm.goods_name"></el-input>
          </el-form-item>
          <el-form-item label="商品价格">
            <el-input v-model="addForm.goods_price"></el-input>
          </el-form-item>
          <el-form-item label="商品重量">
            <el-input v-model="addForm.goods_weight"></el-input>
          </el-form-item>
          <el-form-item label="商品数量">
            <el-input v-model="addForm.goods_number"></el-input>
          </el-form-item>
          <el-form-item label="商品分类">
            <el-cascader
              :options="cateList"
              change-on-select
              v-model="addForm.goods_cat"
              :props="cateprop"
              @change="cateSelect"
            ></el-cascader>
          </el-form-item>
        </el-tab-pane>
        <el-tab-pane label="商品参数" name="1">
          <el-form-item :label="first.attr_name" v-for='first in paramsDy' :key='first.attr_id'>
            <!-- 如果在复选框组中绑定一个catecheckList，那么在有多组的时候，会造成多组复选框都指向一个相同 的数组 -->
            <el-checkbox-group v-model="first.attr_vals">
              <el-checkbox :label="second" v-for='(second,index) in first.attr_vals' :key='index' border></el-checkbox>
            </el-checkbox-group>
          </el-form-item>
        </el-tab-pane>
        <el-tab-pane label="商品属性" name="2">
          <el-form-item :label="item.attr_name" v-for='item in paramsStatic' :key='item.attr_id'>
            <el-input :value='item.attr_vals' readonly></el-input>
          </el-form-item>
        </el-tab-pane>
        <el-tab-pane label="商品图片" name="3">
          <el-upload
            class="upload-demo"
            action="http://localhost:8888/api/private/v1/upload"
            :headers="getToken()"
            :on-preview="handlePreview"
            :on-remove="handleRemove"
            :on-success="handleSuccess"
            :before-upload="handleBefore"
            :file-list="fileList"
            list-type="picture"
            accept=".jpg"
          >
            <el-button size="small" type="primary">点击上传</el-button>
            <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
          </el-upload>
        </el-tab-pane>
        <el-tab-pane label="商品内容" name="4">
          <quill-editor class="myquill" v-model="addForm.goods_introduce"></quill-editor>
        </el-tab-pane>
      </el-tabs>
      <el-button type="primary" class="fr" @click="addGoods">添加商品</el-button>
    </el-form>
  </div>
</template>
<script>
// 引入样式
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'
// 引入组件
import { quillEditor } from 'vue-quill-editor'
import { getAllCateList } from '@/api/cate_index.js'
import { addGoods } from '@/api/goods_index.js'
import { getAllCatePramsList } from '@/api/cate_params.js'
export default {
  // 注册
  components: {
    quillEditor
  },
  data () {
    return {
      catecheckList: [],
      fileList: [],
      activeName: '0',
      addForm: {
        goods_name: '',
        goods_cat: '',
        goods_price: 0,
        goods_number: 0,
        goods_weight: 0,
        goods_introduce: '',
        pics: [],
        attrs: []
      },
      paramsDy: [], // 动态参数
      paramsStatic: [], // 静态参数
      cateprop: {
        label: 'cat_name',
        value: 'cat_id',
        children: 'children'
      },
      cateList: []
    }
  },
  methods: {
    // 感谢大神的分享
    // 可以做当切换到  商品属性和商品参数  标签页的时候，判断用户如果没有选择分类 ，则阻止标签页的跳转
    beforeLeave (activeName, oldActiveName) {
      if (activeName === '1' || activeName === '2') {
        if (this.addForm.goods_cat.length !== 3) {
          this.$message.error('请先选择分类')
          return false
        }
      }
    },
    // 上传文件之前的钩子，里面可以进行文件合法性的判断
    // file就是当前你所选择的文件对象
    handleBefore (file) {
      if (file.type.indexOf('image/') !== 0) {
        this.$message.error('请选择图片')
        // 它会触发handleRemove
        return false
      }
    },
    //   实现商品的添加
    async addGoods () {
      // 收集attrs数据
      for (var i = 0; i < this.paramsDy.length; i++) {
        var id = this.paramsDy[i].attr_id
        for (var j = 0; j < this.paramsDy[i].attr_vals.length; j++) {
          this.addForm.attrs.push({ attr_id: id, attr_value: this.paramsDy[i].attr_vals[j] })
        }
      }
      // 处理分类数据
      this.addForm.goods_cat = this.addForm.goods_cat.join(',')
      // 实现商品的添加
      let res = await addGoods(this.addForm)
      if (res.data.meta.status === 201) {
        this.$message.success('添加商品成功')
        this.$refs.addForm.resetFields()
        this.$router.push({ name: 'list' })
      }
    },
    //   获取token数据
    getToken () {
      var token = localStorage.getItem('itcast_manage_34_token')
      return { Authorization: token }
    },
    //   文件上传成功之后的钩子函数
    handleSuccess (response, file, fileList) {
      if (response.meta.status === 200) {
        // 我们要的数据就在response，我们要将上传成功之后的图片的路径(相对路径)存储到addForm的pics中
        this.addForm.pics.push({ pic: response.data.tmp_path })
      }
    },
    //   移除文件时触发
    handleRemove (file, fileList) {
      // file就是用户当前删除的图片对象
      if (!file.response) {
        return
      }
      var current = file.response.data.tmp_path
      for (var i = 0; i < this.addForm.pics.length; i++) {
        if (this.addForm.pics[i].pic === current) {
          this.addForm.pics.splice(i, 1)
          break
        }
      }
    },
    //   文件预览时触发
    handlePreview (file) {
      console.log(file)
    },
    //   选择级联选项时触发
    cateSelect (obj) {
      console.log(obj)
      console.log(this.addForm.goods_cat)
      console.log(this.addForm.goods_cat.join(','))
    },
    // 单击标签页
    async handleClick (obj) {
      // 判断用户当前点击是哪个标签页选项
      // 只有点击这两个选项才需要进行数据的获取
      if (this.activeName === '1' || this.activeName === '2') {
        if (this.addForm.goods_cat.length !== 3) {
          this.$message.warning('请先选择三级分类')
          return
        }
        // 如果是1，就需要获取动态参数
        if (this.activeName === '1') {
          var res = await getAllCatePramsList(
            this.addForm.goods_cat[2],
            'many'
          )
          // console.log(res)
          this.paramsDy = res.data.data
          console.log(this.paramsDy)
          this.paramsDy.forEach(value => {
            value.attr_vals = value.attr_vals ? value.attr_vals.split(',') : []
            value.attr_vals = [...value.attr_vals]
          })
        } else {
          // 如果是2，就需要获取静态参数
          var res1 = await getAllCatePramsList(
            this.addForm.goods_cat[2],
            'only'
          )
          console.log(res1)
          this.paramsStatic = res1.data.data
        }
      }
    }
  },
  mounted () {
    getAllCateList(3).then(res => {
      console.log(res)
      this.cateList = res.data.data
    })
  }
}
</script>
<style lang="less" scoped>
.myquill {
  // min-height: 200px;
  border-bottom: 1px solid #ccc;
}
</style>
