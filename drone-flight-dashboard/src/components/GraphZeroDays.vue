<template>
  <div class="flight-zero-container">
    <header class="header">
      <h4 class="header-title">Дни без полетов</h4>
      <div class="controls">
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
    <div class="flight-zero-days-chart">
      <v-chart :option="chartOption" autoresize class="chart" />
    </div>
  </div>
</template>

<script>
import { defineComponent, ref, computed } from 'vue';
import VChart from 'vue-echarts';
import 'echarts';

export default defineComponent({
  name: 'FlightZeroDaysChart',
  components: {
    VChart,
  },
  props: {
    flightData: {
      type: Array,
      default: () => [],
    },
  },
  setup() {
    const chartType = ref('line'); // Тип графика по умолчанию

    return { chartType };
  },
  data() {
    return {
      defaultFlightData: [
        { date: '2025-09-01', flights: 5 },
        { date: '2025-09-02', flights: 0 },
        { date: '2025-09-03', flights: 3 },
        { date: '2025-09-04', flights: 0 },
        { date: '2025-09-05', flights: 7 },
        { date: '2025-09-06', flights: 2 },
        { date: '2025-09-07', flights: 0 },
        { date: '2025-09-08', flights: 4 },
        { date: '2025-09-09', flights: 6 },
        { date: '2025-09-10', flights: 1 },
        { date: '2025-09-11', flights: 0 },
        { date: '2025-09-12', flights: 5 },
        { date: '2025-09-13', flights: 3 },
        { date: '2025-09-14', flights: 0 },
        { date: '2025-09-15', flights: 8 },
        { date: '2025-09-16', flights: 2 },
        { date: '2025-09-17', flights: 4 },
        { date: '2025-09-18', flights: 0 },
        { date: '2025-09-19', flights: 6 },
        { date: '2025-09-20', flights: 3 },
        { date: '2025-09-21', flights: 5 },
        { date: '2025-09-22', flights: 0 },
        { date: '2025-09-23', flights: 7 },
        { date: '2025-09-24', flights: 1 },
        { date: '2025-09-25', flights: 4 },
        { date: '2025-09-26', flights: 0 },
        { date: '2025-09-27', flights: 3 },
        { date: '2025-09-28', flights: 2 },
      ],
    };
  },
  computed: {
    chartOption() {
      // Используем данные из пропса, если они есть, иначе defaultFlightData
      const flightData = this.flightData.length > 0 ? this.flightData : this.defaultFlightData;

      // Подготовка данных для осей
      const dates = flightData.map((item) => item.date);
      const flights = flightData.map((item) => item.flights || 0);

      // Выделение дней без полетов с форматированными датами
      const markPoints = flightData
        .filter((item) => item.flights === 0)
        .map((item) => {
          const date = new Date(item.date);
          const formattedDate = new Intl.DateTimeFormat('ru-RU', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
          }).format(date).replace(/\//g, '.');
          return {
            coord: [item.date, 0],
            itemStyle: { color: '#ff4d4f' },
            label: {
              show: true,
              formatter: formattedDate,
              color: '#ff4d4f',
              fontSize: 10,
            },
            symbolSize: 4,
          };
        });

      return {
        tooltip: {
          trigger: 'axis',
          formatter: (params) => {
            const date = new Date(params[0].name);
            const formattedDate = new Intl.DateTimeFormat('ru-RU', {
              day: '2-digit',
              month: '2-digit',
              year: 'numeric',
            }).format(date).replace(/\//g, '.');
            return `${formattedDate}<br />Полёты: ${params[0].value}`;
          },
          backgroundColor: 'rgba(0, 0, 0, 0.8)',
          textStyle: { color: '#fff' },
        },
        xAxis: {
          type: 'category',
          data: dates,
          axisLabel: {
            rotate: 45,
            fontFamily: 'Inter, sans-serif',
            color: '#4b5563',
            fontSize: 12,
            formatter: (value) => {
              const date = new Date(value);
              return new Intl.DateTimeFormat('ru-RU', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric',
              }).format(date).replace(/\//g, '.');
            },
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
          min: 0,
        },
        dataZoom: [
          {
            type: 'slider',
            start: 0,
            end: 100,
            handleSize: 8,
          },
          {
            type: 'inside',
          },
        ],
        series: [
          {
            type: this.chartType,
            data: flights,
            smooth: this.chartType === 'line',
            barWidth: this.chartType === 'bar' ? '10%' : undefined,
            itemStyle: {
              color: '#007bff',
              borderRadius: this.chartType === 'bar' ? [5, 5, 0, 0] : undefined,
            },
            markPoint: {
              data: markPoints,
            },
            animationEasing: 'cubicOut',
            animationDuration: 1000,
          },
        ],
        grid: {
          left: '5%',
          right: '5%',
          top: '15%',
          bottom: '20%',
        },
        toolbox: {
          feature: {
            saveAsImage: { title: 'Сохранить' },
            dataZoom: { title: { zoom: 'Масштаб', back: 'Сброс' } },
          },
        },
        backgroundColor: 'transparent',
      };
    },
  },
});
</script>

<style scoped>
.flight-zero-container {
  width: 530px;
  margin: 2vh 0;
  padding: 10px;
}

.header {
  text-align: left;
  margin-bottom: 15px;
}

.header-title {
  font-size: 1rem;
  font-weight: 700;
  color: #5a5959;
  font-family: 'Inter', sans-serif;
  margin-bottom: 10px;
}

.controls {
  display: flex;
  justify-content: left;
  gap: 10px;
  margin-top: 20px;
  margin-bottom: 20px;
}

.controls button {
  padding: 8px 16px;
  border: none;
  border-radius: 8px;
  background-color: #f5f5f5;
  color: #333;
  font-size: 14px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}
.chart-controls {
  display: flex;
  justify-content: left;
  margin-top: 20px;
  gap: 10px;
  margin-bottom: 20px;
}

.controls button.active,
.controls button:hover {
  background-color: #007bff;
  color: #fff;
}

.flight-zero-days-chart {
  background: #ffffff;
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.chart {
  height: 400px;
  width: 100%;
}

@media (max-width: 768px) {
  .flight-zero-container {
    width: 100%;
  }

  .header-title {
    font-size: 1.2rem;
  }

  .chart {
    height: 300px;
  }
}
</style>