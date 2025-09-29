<template>
  <div class="app-layout">
    <Sidebar />
    
    <div class="main-container">
      <header>
        <Header />
      </header>

      <main class="content">
        <GeneralInformation
          :peakFlightAltitude="12000"
          :totalFlights="150"
          :averageFlightTime="45.5"
          :flightDensity="3.2"
          :totalDistance="25000"
        />
        <div class="charts-row">
          <MonthlyGrowth
            :flightData="[
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
              { month: 'Дек', flights: 330 }
            ]"
          />
          <DailyChart
            :dailyData="[
              { period: 'Утро', flights: 50 },
              { period: 'День', flights: 80 },
              { period: 'Вечер', flights: 60 },
              { period: 'Ночь', flights: 30 }
            ]"
          />
          <div class="topList">
            <TopList />
          </div>
          <ColumnarGraph />
          <GraphZeroDays />
        </div>
      </main>
    </div>
  </div>
</template>

<script setup>
import Header from './components/Header.vue';
import Sidebar from './components/Sidebar.vue';
import GeneralInformation from './components/GeneralInformation.vue';
import MonthlyGrowth from './components/MonthlyGrowth.vue';
import DailyChart from './components/DailyChart.vue';
import ColumnarGraph from './components/ColumnarGraph.vue';
import GraphZeroDays from './components/GraphZeroDays.vue';
import TopList from './components/TopList.vue';

</script>

<style scoped>
.app-layout {
  min-height: 100vh;
  display: flex;
  position: relative;
}


.main-container {
  display: flex;
  flex: 1;
  width: 100%;
  
}

header {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  z-index: 1001;
  background: white;
}

.content {
  flex: 1;
  margin-top: 60px;
  overflow-y: auto;
  background: #f9fafb;
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.charts-row {
  display: flex;
  gap: 20px;
  flex-wrap: wrap;
}

@media (max-width: 768px) {
  .main-container {
    margin-left: 0;
  }

  .content {
    margin-left: 0;
    padding: 16px;
  }

  .charts-row {
    flex-direction: column;
  }
}
</style>