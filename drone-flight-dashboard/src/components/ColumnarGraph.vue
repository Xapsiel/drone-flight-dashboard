<template>
  <div class="columnar-graph-container">
    <header class="header">
      <h1 class="header-title">Показатели полётов</h1>
    </header>

    <div class="chart-controls">
      <button
        :class="{ active: chartType === 'bar' }"
        @click="chartType = 'bar'"
      >
        Столбчатая диаграмма
      </button>
      <button
        :class="{ active: chartType === 'pie' }"
        @click="chartType = 'pie'"
      >
        Круговая диаграмма
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
  name: 'ColumnarGraph',
  components: {
    VChart: VueECharts,
  },
  props: {
    flightStats: {
      type: Object,
      required: true,
      default: () => ({
        AvgDailyFlights: 0,
        MedianDailyFlights: 0,
      }),
    },
  },
  setup(props) {
    const chartType = ref('bar');

    const chartOption = computed(() => {
      const data = [
        { value: props.flightStats.AvgDailyFlights, name: 'Среднее количество полётов' },
        { value: props.flightStats.MedianDailyFlights, name: 'Медианное количество полётов' },
      ];

      if (chartType.value === 'bar') {
        return {
          tooltip: {
            trigger: 'axis',
            backgroundColor: 'rgba(255, 255, 255, 0.9)',
            borderColor: '#ddd',
            textStyle: { color: '#333' },
            formatter: '{b}: {c}',
          },
          xAxis: {
            type: 'category',
            data: data.map(d => d.name),
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
              data: data,
              barWidth: '40%',
              itemStyle: {
                color: params => ['#3b82f6', '#60a5fa'][params.dataIndex],
                borderRadius: [8, 8, 0, 0],
              },
              emphasis: {
                itemStyle: {
                  shadowBlur: 10,
                  shadowColor: 'rgba(0, 0, 0, 0.5)',
                },
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
        };
      } else {
        return {
          tooltip: {
            trigger: 'item',
            backgroundColor: 'rgba(255, 255, 255, 0.9)',
            borderColor: '#ddd',
            textStyle: { color: '#333' },
            formatter: '{b}: {c} ({d}%)',
          },
          series: [
            {
              type: 'pie',
              radius: ['40%', '70%'],
              center: ['50%', '50%'],
              data: data,
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
              color: ['#3b82f6', '#60a5fa'],
              emphasis: {
                itemStyle: {
                  shadowBlur: 10,
                  shadowOffsetX: 0,
                  shadowColor: 'rgba(0, 0, 0, 0.5)',
                },
              },
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
      }
    });

    return {
      chartType,
      chartOption,
    };
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

.chart-controls {
  display: flex;
  justify-content: left;
  margin-top: 20px;
  gap: 10px;
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