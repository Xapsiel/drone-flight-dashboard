<template>
    <div class="flight-zero-container">
    <header class="header">
        <h4 class="header-title">Средние ежедневные показатели</h4>
    </header>
    <div class="flight-zero-days-chart">
      <v-chart :option="chartOption" class="chart" />
    </div>
    </div>
  </template>
  
  <script>
  import { defineComponent } from 'vue';
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
          { date: '2025-09-28', flights: 2 }, // Today: 08:18 PM MSK, Sep 28, 2025
        ],
      };
    },
    computed: {
      chartOption() {
        // Use default data if no prop data is provided
        const flightData = this.flightData.length > 0 ? this.flightData : this.defaultFlightData;
        
        // Prepare data with dates and flights
        const dates = flightData.map((item) => item.date);
        const flights = flightData.map((item) => item.flights || 0);
  
        // Highlight zero-flight days with formatted dates
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
              itemStyle: { color: '#ff4d4f' }, // Simple red point
              label: { 
                show: true, 
                formatter: formattedDate, 
                color: '#ff4d4f',
                fontSize: 10,
              },
              symbolSize: 4, // Smaller red point
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
              return `${formattedDate}<br />Flights: ${params[0].value}`;
            },
            backgroundColor: 'rgba(0, 0, 0, 0.8)',
            textStyle: { color: '#fff' },
          },
          xAxis: {
            type: 'category',
            data: dates,
            axisLabel: {
              rotate: 45,
              formatter: (value) => {
                const date = new Date(value);
                return new Intl.DateTimeFormat('ru-RU', {
                  day: '2-digit',
                  month: '2-digit',
                  year: 'numeric',
                }).format(date).replace(/\//g, '.');
              },
            },
          },
          yAxis: {
            type: 'value',
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
              type: 'line',
              data: flights,
              smooth: true,
              itemStyle: {
                color: '#007bff',
              },
              markPoint: {
                data: markPoints,
              },
            },
          ],
        };
      },
    },
  });
  </script>
  
  <style scoped>

  .flight-zero-container {
    width: 530px;
    margin: 2vh 0 2vh 0;
    padding: 10px;
  }
  .flight-zero-days-chart {
    background: #ffffff;
    border-radius: 12px;
    padding: 20px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  }

  .header-title {
    font-size: 1rem;
    font-weight: 700;
    color: #5a5959;
    font-family: 'Inter', sans-serif;
  }
  
  .chart {
    height: 400px;
    width: 100%;
  }
  </style>