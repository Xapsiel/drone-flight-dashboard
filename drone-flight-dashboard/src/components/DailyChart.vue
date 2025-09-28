<template>
    <div class="daily-chart-container">
      <header class="header">
        <h1 class="header-title">Распределение полетов по времени суток</h1>
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
    name: 'DailyChart',
    components: {
      VChart: VueECharts,
    },
    props: {
      dailyData: {
        type: Array,
        default: () => [
          { period: 'Утро', flights: 50 },
          { period: 'День', flights: 80 },
          { period: 'Вечер', flights: 60 },
          { period: 'Ночь', flights: 30 },
        ],
      },
    },
    setup(props) {
      const chartOption = ref({
        tooltip: {
          trigger: 'item',
          backgroundColor: 'rgba(255, 255, 255, 0.9)',
          borderColor: '#ddd',
          textStyle: { color: '#333' },
          formatter: '{b}: {c} полётов ({d}%)',
        },
        series: [
          {
            type: 'pie',
            radius: ['40%', '70%'], // Внутренний и внешний радиус для "пончика"
            center: ['50%', '50%'], // Центрирование диаграммы
            data: props.dailyData.map(item => ({
              name: item.period,
              value: item.flights,
            })),
            label: {
              fontFamily: 'Inter, sans-serif',
              color: '#4b5563',
              fontSize: 12,
            },
            itemStyle: {
              borderRadius: 8,
              borderColor: '#fff',
              borderWidth: 2,
            },
            color: ['#3b82f6', '#60a5fa', '#93c5fd', '#dbeafe'], // Цвета для периодов
            animationEasing: 'cubicOut',
            animationDuration: 1000,
          },
        ],
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
  .daily-chart-container {
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
    .daily-chart-container {
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