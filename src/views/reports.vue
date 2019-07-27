<template>
    <div class="reports">
        <v-chart :options='option'></v-chart>
    </div>
</template>
<script>
import ECharts from 'vue-echarts'
import 'echarts/lib/chart/line'
import 'echarts/lib/component/polar'
import { getlist } from '@/api/report_index.js'
export default {
  components: {
    'v-chart': ECharts
  },
  data () {
    return {
      option: {}
    }
  },
  mounted () {
    getlist()
      .then(res => {
        console.log(res)
        this.option = res.data.data
      })
  }
}
</script>
<style lang="less" scoped>

</style>
