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
        // 最大值最小值
        min: 0,
        max: 100
      },
      yAxis: {
        show: false,
        type: 'category'
      },
      // 系列
      series: [
        {
          type: 'bar',
          data: [78],
          // 柱状图的宽度
          barWidth: 15,
          color: 'yellowgreen',
          // 柱状背景颜色
          showBackground: true,
          backgroundStyle: {
            color: '#eee'
          },
          // 文本
          label: {
            show: true,
            // 改变文本内容
            formatter: '|',
            // 文本位置
            position: 'right'
          }
        }
      ],
      // 布局
      grid: {
        left: 8,
        top: 0,
        right: 0,
        buttom: 0
      }
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
