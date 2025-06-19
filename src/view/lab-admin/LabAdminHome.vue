<template>
  <div class="charts-wrapper">
    <div id="pieChart" class="chart"></div>
    <div id="barChart" class="chart"></div>
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import * as echarts from 'echarts'
import axios from 'axios'

onMounted(async () => {
  // 拉数据
  const res = await axios.get('/api/admin/lab-status')
  const result = res.data.data  
  const idle = result['空闲中'] ?? 0
  const used = result['使用中'] ?? 0

  console.log('空闲中：', idle, '使用中：', used)
  // 饼图
  const pie = echarts.init(document.getElementById('pieChart'))
  pie.setOption({
    title:{text:'实验室状态统计（饼图）',left:'center'},
    legend:{bottom:10},
    tooltip:{trigger:'item'},
    series:[{
      type:'pie',
      radius:'60%',
      data:[{value:idle,name:'空闲中'},{value:used,name:'使用中'}]
    }]
  })

  // 柱状图
  const bar = echarts.init(document.getElementById('barChart'))
  bar.setOption({
    title:{text:'实验室状态统计（柱状图）',left:'center'},
    xAxis:{type:'category',data:['空闲中','使用中']},
    yAxis:{type:'value'},
    series:[{type:'bar',data:[idle,used]}]
  })

  window.addEventListener('resize',()=>{pie.resize();bar.resize()})
})
</script>

<style scoped>
.charts-wrapper{display:flex;gap:24px}
.chart{flex:1;height:360px;background:#fff;border-radius:12px;box-shadow:0 2px 8px rgba(0,0,0,.08);padding:12px}
</style>