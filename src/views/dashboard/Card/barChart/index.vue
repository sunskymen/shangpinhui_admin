<template>
  <div class="charts" ref="charts">
  </div>
</template>

<script>
import echarts from 'echarts'
export default {
  mounted() {
    const lineCharts = echarts.init(this.$refs.charts)
    lineCharts.setOption({
      xAxis: {
        show: false,
        type: 'category'
      },
      yAxis: {
        show: false
      },
      // 系列
      series: [
        {
          type: 'bar',
          data: [10, 12, 15, 16, 11, 13, 14, 17, 15, 12, 10]
        }
      ],
      // 布局
      grid: {
        left: 8,
        top: -20,
        right: 0,
        buttom: 0
      },
      // 提示
      tooltip: {}
    })
  }
}
</script>

<style>
.charts {
  width: 100%;
  height: 100%;
}
</style>
