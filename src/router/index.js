// 引入vue
import Vue from 'vue'
// 引入vue-router
import VueRouter from 'vue-router'
// 引入登陆组件
import Login from '@/views/login.vue'
import Home from '@/views/home.vue'
import Welcome from '@/views/welcome.vue'
// 使用
Vue.use(VueRouter)
// 创建路由对象
var router = new VueRouter({
  // 添加路由配置
  routes: [
    {
      name: 'default',
      path: '/',
      redirect: { name: 'login' }
    },
    {
      name: 'login',
      path: '/login',
      component: Login
    },
    {
      name: 'home',
      path: '/home',
      component: Home,
      // 添加路由重定向
      redirect: { name: 'welcome' },
      // 添加嵌套路由
      children: [
        {
          name: 'welcome',
          path: 'welcome',
          component: Welcome
        }
      ]
    }
  ]
})
// 暴露
export default router
