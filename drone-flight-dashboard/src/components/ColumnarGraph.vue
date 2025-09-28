<template>
    <div class="columnar-graph-container">
      <header class="header">
        <h1 class="header-title">Средние ежедневные показатели</h1>
      </header>
      <div class="chart-section">
        <v-chart :option="chartOption" autoresize class="chart" />
      </div>
    </div>
  </template>
  
  <script>
  import { ref } from 'vue';
  import VueECharts from 'vue-echarts';
  import 'echarts';
  
  export default {
    name: 'ColumnarGraph',
    components: {
      VChart: VueECharts,
    },
    props: {
      averageDailyFlights: { type: Number, default: 150 },
      averageDailyTrips: { type: Number, default: 120 },
    },
    setup(props) {
      const chartOption = ref({
        tooltip: {
          trigger: 'axis',
          backgroundColor: 'rgba(255, 255, 255, 0.9)',
          borderColor: '#ddd',
          textStyle: { color: '#333' },
          formatter: '{b}: {c}',
        },
        xAxis: {
          type: 'category',
          data: ['Полёты', 'Рейсы'],
          axisLabel: {
            fontFamily: 'Inter, sans-serif',
            color: '#4b5563',
            fontSize: 12,
          },
          axisLine: { lineStyle: { color: '#9ca3af' } },
          splitLine: { show: false },
        },
        yAxis: {
          type: 'value',
          name: 'Количество',
          nameTextStyle: { fontFamily: 'Inter, sans-serif', color: '#4b5563' },
          axisLabel: { fontFamily: 'Inter, sans-serif', color: '#4b5563' },
          axisLine: { lineStyle: { color: '#9ca3af' } },
          splitLine: { lineStyle: { color: '#e5e7eb', type: 'dashed' } },
        },
        series: [
          {
            type: 'bar',
            data: [
              { value: props.averageDailyFlights, name: 'Полёты' },
              { value: props.averageDailyTrips, name: 'Рейсы' },
            ],
            barWidth: '40%',
            itemStyle: {
              color: params => ['#3b82f6', '#60a5fa'][params.dataIndex],
              borderRadius: [8, 8, 0, 0],
            },
            emphasis: {
              itemStyle: { shadowBlur: 10, shadowColor: 'rgba(0, 0, 0, 0.5)' },
            },
            animationEasing: 'cubicOut',
            animationDuration: 1000,
          },
        ],
        grid: {
          left: '5%',
          right: '5%',
          top: '15%',
          bottom: '10%',
        },
        toolbox: {
          feature: {
            saveAsImage: { title: 'Сохранить' },
          },
        },
        backgroundColor: 'transparent',
      });
  
      return { chartOption };
    },
  };
  </script>
  
  <style scoped>
  .columnar-graph-container {
    width: 530px;
    margin: 2vh 0;
    padding: 10px;
  }
  
  
  .header-title {
    font-size: 1rem;
    font-weight: 700;
    color: #5a5959;
    font-family: 'Inter', sans-serif;
  }
  
  .chart-section {
    background: #ffffff;
    border-radius: 12px;
    padding: 20px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  }
  
  .chart {
    height: 400px;
  }
  
  @media (max-width: 768px) {
    .columnar-graph-container {
      width: 100%;
    }
  
    .header-title {
      font-size: 1.5rem;
    }
  
    .chart {
      height: 300px;
    }
  }
  </style>