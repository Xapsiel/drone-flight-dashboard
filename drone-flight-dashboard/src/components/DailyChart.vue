<template>
  <div class="daily-chart-container">
    <header class="header">
      <h1 class="header-title">Распределение полетов по времени суток</h1>
    </header>
    <div class="chart-controls">
      <button
        :class="{ active: chartType === 'pie' }"
        @click="chartType = 'pie'"
      >
        Круговая диаграмма
      </button>
      <button
        :class="{ active: chartType === 'bar' }"
        @click="chartType = 'bar'"
      >
        Столбчатая диаграмма
      </button>
    </div>
    <div class="chart-section">
      <v-chart :option="chartOption" autoresize class="chart" />
    </div>
  </div>
</template>

<script>
import { ref, computed } from 'vue';
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
    const chartType = ref('pie'); // Тип графика по умолчанию

    const chartOption = computed(() => {
      if (chartType.value === 'pie') {
        return {
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
        };
      } else {
        return {
          tooltip: {
            trigger: 'axis',
            backgroundColor: 'rgba(255, 255, 255, 0.9)',
            borderColor: '#ddd',
            textStyle: { color: '#333' },
            formatter: '{b}: {c} полётов',
          },
          xAxis: {
            type: 'category',
            data: props.dailyData.map(item => item.period),
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
              type: 'bar',
              data: props.dailyData.map(item => item.flights),
              barWidth: '20%',
              itemStyle: {
                color: '#3b82f6',
                borderRadius: [5, 5, 0, 0],
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
              dataZoom: { title: { zoom: 'Масштаб', back: 'Сброс' } },
            },
          },
          backgroundColor: 'transparent',
        };
      }
    });

    return { chartOption, chartType };
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
  background-color: #3b82f6;
  color: #fff;
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