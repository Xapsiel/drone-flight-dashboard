<template>
  <div class="graph-zero-days">
    <header class="header">
      <h2>Дни без полетов</h2>

    <div class="chart-controls">
      <button
        :class="{ active: chartType === 'line' }"
        @click="chartType = 'line'"
      >
        Линейный график
      </button>
      <button
        :class="{ active: chartType === 'bar' }"
        @click="chartType = 'bar'"
      >
        Столбчатая диаграмма
      </button>
    </div>
    </header>

    <div class="chart-container">
      <v-chart
        v-if="props.zeroFlightDaysData.length"
        class="chart"
        :option="chartOption"
        autoresize
      />
      <p v-else>Нет данных для отображения.</p>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, provide } from 'vue';
import { use } from 'echarts/core';
import { CanvasRenderer } from 'echarts/renderers';
import { LineChart, BarChart } from 'echarts/charts';
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
  BarChart,
  TitleComponent,
  TooltipComponent,
  LegendComponent,
  GridComponent,
]);

provide(THEME_KEY, 'light');

const props = defineProps({
  zeroFlightDaysData: {
    type: Array,
    required: true,
    default: () => [],
  },
});

const chartType = ref('line');

onMounted(() => {
  console.log('🏁 [GraphZeroDays] Mounted, zeroFlightDaysData:', props.zeroFlightDaysData);
  console.log('🏁 [GraphZeroDays] chartType:', chartType.value);
});

const chartOption = computed(() => {
  const data = props.zeroFlightDaysData.length ? props.zeroFlightDaysData : [];
  const regions = data.map(item => item.region || 'Unknown');
  const zeroDays = data.map(item => item.zeroFlightDays || 0);

  const baseOption = {
    title: {
      text: '',
      left: 'center',
    },
    tooltip: {
      trigger: chartType.value === 'line' ? 'axis' : 'item',
      formatter: (params) => {
        return `${params.name || params[0].name}: ${params.value || params[0].value} дней`;
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
      data: regions,
      axisLabel: {
        rotate: 45,
      },
    },
    yAxis: {
      type: 'value',
      name: 'Количество',
      axisLabel: {
        formatter: '{value}',
      },
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '15%',
      containLabel: true,
    },
    animationDuration: 1000,
  };

  if (chartType.value === 'line') {
    return {
      ...baseOption,
      series: [
        {
          name: '',
          type: 'line',
          data: zeroDays,
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
    };
  } else {
    return {
      ...baseOption,
      series: [
        {
          name: '',
          type: 'bar',
          data: zeroDays,
          itemStyle: {
            color: {
              type: 'linear',
              x: 0,
              y: 0,
              x2: 0,
              y2: 1,
              colorStops: [
                { offset: 0, color: '#3b82f6' },
                { offset: 1, color: '#3b82f6' },
              ],
            },
            borderRadius: [5, 5, 0, 0],
          },
          
          emphasis: {
            itemStyle: {
              shadowBlur: 10,
              shadowColor: 'rgba(0, 0, 0, 0.5)',
            },
          },
          barWidth: '60%',
        },
        
      ],
    };
  }
});
</script>

<style scoped>
.graph-zero-days {
  width: 530px;
  margin: 2vh 0;
  padding: 10px;
}

@media (max-width: 768px) {
  .graph-zero-days {
    width: 100%;
  }
}

h2 {
  font-size: 1rem;
  font-weight: 700;
  color: #5a5959;
  font-family: 'Inter', sans-serif;
  margin-bottom: 16px;
}

.chart-controls {
  display: flex;
  justify-content: flex-start;
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
  background-color: #3b82f6;
  color: #fff;
}

.chart-container {
  position: relative;
  width: 100%;
  padding: 20px;
  background: white;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  border-radius: 12px;
  min-height: 400px;
  height: 430px;
  overflow: visible;
}

@media (max-width: 768px) {
  .chart-container {
    height: 300px;
    min-height: 300px;
  }

  h2 {
    font-size: 1.5rem;
  }
}

.chart {
  height: 460px;
  width: 100%;
}
</style>
