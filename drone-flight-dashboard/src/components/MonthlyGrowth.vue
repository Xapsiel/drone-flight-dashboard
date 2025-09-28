<template>
    <div class="monthly-growth-container">
      <header class="header">
        <h1 class="header-title">Рост количества полетов по месяцам</h1>
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
    name: 'MonthlyGrowth',
    components: {
      VChart: VueECharts,
    },
    props: {
      flightData: {
        type: Array,
        default: () => [
          { month: 'Янв', flights: 120 },
          { month: 'Фев', flights: 135 },
          { month: 'Мар', flights: 150 },
          { month: 'Апр', flights: 170 },
          { month: 'Май', flights: 200 },
          { month: 'Июн', flights: 230 },
          { month: 'Июл', flights: 260 },
          { month: 'Авг', flights: 250 },
          { month: 'Сен', flights: 270 },
          { month: 'Окт', flights: 290 },
          { month: 'Ноя', flights: 310 },
          { month: 'Дек', flights: 330 },
        ],
      },
    },
    setup(props) {
      const chartOption = ref({
        tooltip: {
          trigger: 'axis',
          backgroundColor: 'rgba(255, 255, 255, 0.9)',
          borderColor: '#ddd',
          textStyle: { color: '#333' },
          formatter: 'Месяц: {b}<br>Полёты: {c}',
        },
        xAxis: {
          type: 'category',
          data: props.flightData.map(item => item.month),
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
          name: 'Количество полётов',
          nameTextStyle: { fontFamily: 'Inter, sans-serif', color: '#4b5563' },
          axisLabel: { fontFamily: 'Inter, sans-serif', color: '#4b5563' },
          axisLine: { lineStyle: { color: '#9ca3af' } },
          splitLine: { lineStyle: { color: '#e5e7eb', type: 'dashed' } },
        },
        series: [
          {
            type: 'line',
            data: props.flightData.map(item => item.flights),
            smooth: true,
            lineStyle: { color: '#3b82f6', width: 3 },
            areaStyle: { color: 'rgba(59, 130, 246, 0.2)' },
            itemStyle: { color: '#3b82f6' },
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
            dataZoom: { title: { zoom: 'Масштаб', back: 'Сброс' } },
          },
        },
        backgroundColor: 'transparent',
      });
  
      return { chartOption };
    },
  };
  </script>
  
  <style scoped>
  .monthly-growth-container {
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
    .monthly-growth-container {
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