<template>
  <div class="monthly-growth">
    <header class="header">
      <h1>Рост количества полетов по месяцам</h1>
      <div class="chart-controls">
      <button
        :class="{ active: chartType === 'line' }"
        @click="chartType = 'line'"
      >
        Линейный график
      </button>
      <button
        :class="{ active: chartType === 'pie' }"
        @click="chartType = 'pie'"
      >
        Круговая диаграмма
      </button>
    </div>
    </header>
    <div class="chart-container">
      <v-chart
        v-if="props.flightData.length"
        class="chart"
        :option="chartOption"
        autoresize
      />
      <p v-else>Нет данных для отображения. Проверьте подключение к серверу или данные за 2025 год.</p>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, provide } from 'vue';
import { use } from 'echarts/core';
import { CanvasRenderer } from 'echarts/renderers';
import { LineChart, PieChart } from 'echarts/charts';
import {
  TitleComponent,
  TooltipComponent,
  LegendComponent,
  GridComponent,
} from 'echarts/components';
import VChart, { THEME_KEY } from 'vue-echarts';

use([
  CanvasRenderer,
  LineChart,
  PieChart,
  TitleComponent,
  TooltipComponent,
  LegendComponent,
  GridComponent,
]);

provide(THEME_KEY, 'light'); 
const props = defineProps({
  flightData: {
    type: Array,
    required: true,
    default: () => [],
  },
});

const chartType = ref('line');

onMounted(() => {
  console.log('🏁 [MonthlyGrowth] Mounted, flightData:', props.flightData);
  console.log('🏁 [MonthlyGrowth] chartType:', chartType.value);
});


const chartOption = computed(() => {
  const data = props.flightData.length ? props.flightData : [
    { month: 'Янв', flights: 0 },
    { month: 'Фев', flights: 0 },
    { month: 'Мар', flights: 0 },
    { month: 'Апр', flights: 0 },
    { month: 'Май', flights: 0 },
    { month: 'Июн', flights: 0 },
    { month: 'Июл', flights: 0 },
    { month: 'Авг', flights: 0 },
    { month: 'Сен', flights: 0 },
    { month: 'Окт', flights: 0 },
    { month: 'Ноя', flights: 0 },
    { month: 'Дек', flights: 0 },
  ];

  const months = data.map(item => item.month);
  const flights = data.map(item => Number(item.flights).toFixed(3));

  if (chartType.value === 'line') {
    return {
      title: {
        text: '',
        left: 'left',
      },
      tooltip: {
        trigger: 'axis',
        formatter: (params) => {
          return `${params[0].name}: ${params[0].value}`;
        },
      },
      toolbox: {
      feature: {
        saveAsImage: {
          title: 'Сохранить',
        },
      },
    },
      xAxis: {
        type: 'category',
        data: months,
      },
      yAxis: {
        type: 'value',
        name: 'Количество',
        axisLabel: {
          formatter: '{value}',
        },
      },
      series: [
        {
          name: 'Количество полетов',
          type: 'line',
          data: flights,
          smooth: true, 
          symbol: 'circle',
          symbolSize: 6,
          itemStyle: {
            color: '#5470c6',
          },
          lineStyle: {
            width: 3,
          },
          areaStyle: {
            color: {
              type: 'linear',
              x: 0,
              y: 0,
              x2: 0,
              y2: 1,
              colorStops: [
                { offset: 0, color: 'rgba(84, 112, 198, 0.6)' },
                { offset: 1, color: 'rgba(84, 112, 198, 0.1)' },
              ],
            },
          },
        },
      ],
      animationDuration: 1000,
    };
  } else { 
    return {
      title: {
        text: '',
        left: 'center',
      },
      tooltip: {
        trigger: 'item',
        formatter: '{a} <br/>{b}: {c} ({d}%)',
      },
      legend: {
        orient: 'vertical',
        right: 'right',
        top: '15%',
      },
      series: [
        {
          name: 'Количество полетов',
          type: 'pie',
          radius: '55%',
          center: ['44%', '50%'],
          data: data.map(item => ({
            value: Number(item.flights).toFixed(3),
            name: item.month,
          })),
          emphasis: {
            itemStyle: {
              shadowBlur: 10,
              shadowOffsetX: 0,
              shadowColor: 'rgba(0, 0, 0, 0.5)',
            },
          },
          itemStyle: {
            borderRadius: 5,
            borderColor: '#fff',
            borderWidth: 2,
          },
        },
      ],
      color: [
        '#5470c6', '#91cc75', '#fac858', '#ee6666', '#73c0de',
        '#3ba272', '#fc8452', '#9a60b4', '#ea7ccc', '#ff9f7f',
        '#67e0e3', '#c4ebad',
      ], 
      animationType: 'scale',
      animationEasing: 'elasticOut',
      animationDelay: 20,
    };
  }
});
</script>

<style scoped>
.monthly-growth {
  padding: 12px;
  border-radius: 8px;
  width: 100%;
  width: 530px;
}
.header{
  margin: 2vh 0;
}
h1{
  font-size: 1rem;
  font-weight: 700;
  color: #5a5959;
  font-family: 'Inter', sans-serif;
}

.chart-controls {
  display: flex;
  justify-content: left;
  gap: 10px;
  margin-top: 20px;
  margin-bottom: 20px;
}


.chart-controls button {
  padding: 8px 16px;
  border: none;
  border-radius: 8px;
  background-color: #f5f5f5;
  color: #333;
  font-size: 14px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.chart-controls button.active,
.chart-controls button:hover {
  background: #007bff;
  color: white;
}

.chart-container {
  position: relative;
  height: 440px;
  padding: 20px;
  background: white;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  width: 100%;
  border-radius: 12px;
  min-height: 300px;
  overflow: visible;
}

.chart {
  height: 450px;
  width: 100%;
}

</style>