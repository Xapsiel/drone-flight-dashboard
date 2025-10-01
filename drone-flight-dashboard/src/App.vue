<template>
  <div class="app-layout">
    <!-- Показываем страницу входа, если пользователь не авторизован -->
    <LoginPage v-if="!isAuthenticated && !isLoading" />

    <!-- Показываем основное приложение, если пользователь авторизован -->
    <div v-else-if="isAuthenticated" class="app-content">
      <Sidebar :current-view="currentView" @view-change="handleViewChange" />
      <div class="main-container">
        <header>
          <Header />
        </header>
        <main class="content">
          <!-- Отображаем дашборд только когда выбран соответствующий вид -->
          <div v-if="currentView === 'dashboard'">
            <div v-if="isDataLoading" class="loading-screen">
              <div class="loading-spinner"></div>
              <p>Загрузка данных...</p>
            </div>
            <div v-else-if="isDataLoaded" class="dashboard-content">
              <GeneralInformation
                :peak-flight-altitude="generalMetrics.peakFlightAltitude"
                :total-flights="generalMetrics.totalFlights"
                :average-flight-time="generalMetrics.averageFlightTime"
                :flight-density="generalMetrics.flightDensity"
                :total-distance="generalMetrics.totalDistance"
              />
              <div class="charts-row">
                <MonthlyGrowth :flight-data="monthlyFlightData" />
                <DailyChart :daily-data="dailyFlightData" />
                <div class="topList">
                  <TopList :top-list-data="topListData" :sort-type="sortType" @update:sort-type="updateSortType" />
                </div>
                <ColumnarGraph :flight-stats="flightStats" />
                <GraphZeroDays :zero-flight-days-data="zeroFlightDaysData" />
              </div>
            </div>
            <div v-else class="error-screen">
              <p>Не удалось загрузить данные дашборда. Пожалуйста, попробуйте снова.</p>
              <button @click="fetchMetrics">Повторить попытку</button>
            </div>
          </div>

          <!-- Отображаем топографию -->
          <TopoMap v-if="currentView === 'topography'" />

          <!-- Отображаем админку -->
          <AdminPage v-else-if="currentView === 'admin'" />

          <!-- Отображаем аналитику -->
          <div v-else-if="currentView === 'analytics'">
            <h2>Аналитика</h2>
            <p>Страница аналитики находится в разработке</p>
          </div>
        </main>
      </div>
    </div>

    <!-- Показываем загрузку -->
    <div v-else class="loading-screen">
      <div class="loading-spinner"></div>
      <p>Проверка авторизации...</p>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import axios from 'axios';
import GeneralInformation from './components/GeneralInformation.vue';
import MonthlyGrowth from './components/MonthlyGrowth.vue';
import DailyChart from './components/DailyChart.vue';
import ColumnarGraph from './components/ColumnarGraph.vue';
import GraphZeroDays from './components/GraphZeroDays.vue';
import TopList from './components/TopList.vue';
import Header from './components/Header.vue';
import Sidebar from './components/Sidebar.vue';
import TopoMap from './components/TopoMap.vue';
import AdminPage from './components/AdminPage.vue';
import LoginPage from './components/LoginPage.vue';
import authService from './services/auth.js';

const currentView = ref('dashboard');
const isLoading = ref(true);
const isDataLoading = ref(false);
const isDataLoaded = ref(false);
const generalMetrics = ref({
  peakFlightAltitude: 0,
  totalFlights: 0,
  averageFlightTime: 0,
  flightDensity: 0,
  totalDistance: 0,
});
const monthlyFlightData = ref([]);
const dailyFlightData = ref([]);
const dailyMetricsData = ref([]);
const zeroFlightDaysData = ref([]);
const topListData = ref([]);
const sortType = ref('flights');

const isAuthenticated = computed(() => authService.isAuthenticated);
const flightStats = computed(() => {
  const avgDailyFlights = dailyMetricsData.value.reduce((sum, region) => 
    sum + region.averageDailyFlights, 0) / dailyMetricsData.value.length || 0;
  
  // Для медианы нужно вычислить медианное значение
  const dailyFlights = dailyMetricsData.value.map(region => region.averageDailyFlights);
  const medianDailyFlights = calculateMedian(dailyFlights);
  
  return {
    AvgDailyFlights: Number(avgDailyFlights.toFixed(3)),
    MedianDailyFlights: Number(medianDailyFlights.toFixed(3)),
  };
});

// Функция для вычисления медианы
const calculateMedian = (numbers) => {
  if (numbers.length === 0) return 0;
  
  const sorted = [...numbers].sort((a, b) => a - b);
  const middle = Math.floor(sorted.length / 2);
  
  if (sorted.length % 2 === 0) {
    return (sorted[middle - 1] + sorted[middle]) / 2;
  }
  
  return sorted[middle];
};
const handleViewChange = (view) => {
  if (view === 'admin' && !authService.canAccessAdmin()) {
    alert('У вас нет доступа к админской панели');
    return;
  }
  currentView.value = view;
  if (view === 'dashboard') {
    fetchMetrics();
  }
};

const updateSortType = (newSortType) => {
  sortType.value = newSortType;
};

const fetchMetrics = async () => {
  isDataLoading.value = true;
  isDataLoaded.value = false;
  try {
    let token;
    if (typeof authService.getToken === 'function') {
      token = authService.getToken();
    } else {
      console.warn('authService.getToken is not a function, falling back to localStorage');
      token = localStorage.getItem('auth_token');
    }

    if (!token) {
      throw new Error('No authentication token available');
    }

    const response = await axios.get('http://localhost:8080/metrics/all?year=2025', {
      params: { year: 2025 },
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    const data = response.data.data; // Access the 'data' key
    console.log('🏁 [App] Backend response:', JSON.stringify(data, null, 2));

    // Validate and assign general metrics with 3 decimal places for flightDensity and averageFlightTime
    generalMetrics.value = {
      peakFlightAltitude: data.reduce((max, region) => Math.max(max, region.PeakLoad || 0), 0),
      totalFlights: data.reduce((sum, region) => sum + (region.TotalFlight || 0), 0),
      averageFlightTime: Number(
        (data.reduce((sum, region) => sum + (region.AvgDurationMinutes || 0), 0) / data.length || 0).toFixed(3)
      ),
      flightDensity: Number(
        (data.reduce((sum, region) => sum + (region.FlightDensity || 0), 0) / data.length || 0).toFixed(3)
      ),
      totalDistance: data.reduce((sum, region) => sum + (region.TotalDistance || 0), 0),
    };

    // Prepare data for MonthlyGrowth
    monthlyFlightData.value = Array.from({ length: 12 }, (_, index) => {
      const monthIndex = index + 1;
      const flights = data.reduce((sum, region) => {
        const monthlyGrowth = region.MonthlyGrowth || {};
        return sum + (parseFloat(monthlyGrowth[monthIndex]) || 0);
      }, 0);
      return { month: getMonthName(monthIndex), flights: Number(flights.toFixed(3)) };
    });
    console.log('🏁 [App] Final monthlyFlightData:', monthlyFlightData.value);

    // Prepare data for DailyChart
    dailyFlightData.value = ['Morning', 'Day', 'Evening', 'Night'].map(period => ({
      period: getPeriodName(period),
      flights: data.reduce((sum, region) => sum + (region[`${period}Flights`] || 0), 0),
    }));

    // Prepare data for ColumnarGraph
    dailyMetricsData.value = data.map(region => ({
      region: region.RegionName || 'Unknown',
      averageDailyFlights: Number((region.AvgDailyFlights || 0).toFixed(3)),
    }));

    // Prepare data for GraphZeroDays
    zeroFlightDaysData.value = data.map(region => ({
      region: region.RegionName || 'Unknown',
      zeroFlightDays: (region.ZeroFlightDays || []).length,
    }));

    // Prepare data for TopList
    topListData.value = data.map(region => ({
      region: region.RegionName || 'Unknown',
      flights: region.TotalFlight || 0,
      duration: Number((region.AvgDurationMinutes || 0).toFixed(3)),
    }));

    isDataLoaded.value = true;
  } catch (error) {
    console.error('🏁 [App] Ошибка получения метрик:', error);
    alert('Не удалось загрузить данные. Попробуйте позже.');
    // Fallback data
    monthlyFlightData.value = Array.from({ length: 12 }, (_, i) => ({
      month: getMonthName(i + 1),
      flights: 0,
    }));
  } finally {
    isDataLoading.value = false;
  }
};

const getMonthName = (monthIndex) => {
  const months = ['Янв', 'Фев', 'Мар', 'Апр', 'Май', 'Июн', 'Июл', 'Авг', 'Сен', 'Окт', 'Ноя', 'Дек'];
  return months[monthIndex - 1] || 'Неизвестно';
};

const getPeriodName = (period) => {
  const periodMap = {
    Morning: 'Утро',
    Day: 'День',
    Evening: 'Вечер',
    Night: 'Ночь',
  };
  return periodMap[period] || period || 'Неизвестно';
};

onMounted(async () => {
  try {
    console.log('🏁 [App] Инициализация приложения...');
    console.log('🏁 [App] URL:', window.location.href);
    console.log('🏁 [App] Search params:', window.location.search);
    console.log('🏁 [App] authService:', authService);

    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get('token');

    console.log('🏁 [App] Токен из URL:', token ? 'ЕСТЬ' : 'НЕТ');
    if (token) {
      console.log('🏁 [App] ПОЛНЫЙ ТОКЕН ИЗ URL:', token);
      console.log('🏁 [App] Токен (первые 20 символов):', token.substring(0, 20) + '...');
    }
    const storedToken = localStorage.getItem('auth_token');
    console.log('🏁 [App] Токен в localStorage:', storedToken ? 'ЕСТЬ' : 'НЕТ');
    if (storedToken) {
      console.log('🏁 [App] ПОЛНЫЙ ТОКЕН В LOCALSTORAGE:', storedToken);
    }

    console.log('🏁 [App] Все cookies:', document.cookie);
    const cookieToken = document.cookie.split(';').find(cookie => cookie.trim().startsWith('auth_token='));
    if (cookieToken) {
      const tokenValue = cookieToken.split('=')[1];
      console.log('🏁 [App] Токен в cookies:', tokenValue ? 'ЕСТЬ' : 'НЕТ');
      if (tokenValue) {
        console.log('🏁 [App] ПОЛНЫЙ ТОКЕН В COOKIES:', tokenValue);
      }
    } else {
      console.log('🏁 [App] Токен в cookies: НЕТ');
    }

    if (token) {
      console.log('🏁 [App] Устанавливаем токен из URL...');
      authService.setToken(token);
      console.log('🏁 [App] Токен установлен, isAuthenticated:', authService.isAuthenticated);
      window.history.replaceState({}, document.title, window.location.pathname);
      console.log('🏁 [App] URL очищен от токена');
    }

    if (authService.isAuthenticated) {
      console.log('🏁 [App] Пользователь авторизован, получаем данные...');
      try {
        await authService.getCurrentUser();
        console.log('🏁 [App] Пользователь получен:', authService.user);
        if (currentView.value === 'dashboard') {
          await fetchMetrics();
        }
      } catch (userError) {
        console.error('🏁 [App] Ошибка получения пользователя:', userError);
      }
    } else {
      console.log('🏁 [App] Пользователь НЕ авторизован');
    }

    console.log('🏁 [App] Инициализация завершена:', {
      isAuthenticated: authService.isAuthenticated,
      hasUser: !!authService.user,
      currentView: currentView.value,
    });
  } catch (error) {
    console.error('🏁 [App] Ошибка инициализации:', error);
  } finally {
    console.log('🏁 [App] Устанавливаем isLoading = false');
    isLoading.value = false;
  }
});
</script>
<style scoped>
.app-layout {
  min-height: 100vh;
  display: flex;
  position: relative;
}

.app-content {
  display: flex;
  width: 100%;
}

.main-container {
  flex: 1;
  margin-left: 280px; /* Отступ для фиксированного сайдбара */
  display: flex;
  flex-direction: column;
}

header {
  position: fixed;
  top: 0;
  left: 280px; /* Сдвиг шапки для учета сайдбара */
  width: calc(100% - 280px); /* Ширина шапки с учетом сайдбара */
  z-index: 1001;
  background: white;
}

.content {
  margin-top: 60px; /* Отступ для фиксированной шапки */
  padding: 16px;
  background: #f9fafb;
  display: flex;
  flex-direction: column;
  gap: 20px;
  min-height: calc(100vh - 60px); /* Учитываем высоту шапки */
}

.charts-row {
  display: flex;
  gap: 20px;
  flex-wrap: wrap;
}

.loading-screen,
.error-screen {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  background: #f9fafb;
}

.loading-spinner {
  border: 4px solid #f3f3f3;
  border-top: 4px solid #007bff;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.error-screen button {
  margin-top: 10px;
  padding: 8px 16px;
  background: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.error-screen button:hover {
  background: #0056b3;
}

@media (max-width: 768px) {
  .app-content {
    flex-direction: column;
  }

  .main-container {
    margin-left: 0; /* Убираем отступ, если сайдбар скрыт */
  }

  header {
    left: 0;
    width: 100%; /* Шапка на всю ширину на мобильных */
  }

  .content {
    margin-top: 60px;
    padding: 16px;
  }

  .charts-row {
    flex-direction: column;
  }
}

/* Планшеты в горизонтальной ориентации (768px–1023px) */
@media (min-width: 768px) and (max-width: 1023px) {
  .app-content {
    flex-direction: row;
  }

  .main-container {
    margin-left: 200px; /* Уменьшаем ширину сайдбара */
  }

  header {
    left: 200px;
    width: calc(100% - 200px);
  }

  .charts-row {
    flex-direction: row;
    flex-wrap: wrap;
    gap: 16px;
  }

  .topList,
  .charts-row > * {
    flex: 1 1 48%; /* Графики делятся на 2 колонки */
  }
}

/* Мобильные устройства (до 768px) */
@media (max-width: 767px) {
  .app-content {
    flex-direction: column;
  }

  .main-container {
    margin-left: 0;
  }

  header {
    left: 0;
    width: 100%;
  }
 

  .charts-row {
    flex-direction: column;
  }

  .topList,
  .charts-row > * {
    flex: 1 1 100%;
  }
}

/* Мониторы (от 1024px и выше) — поведение по умолчанию */
@media (min-width: 1024px) {
  .main-container {
    margin-left: 280px;
  }

  header {
    left: 280px;
    width: calc(100% - 280px);
  }

  .charts-row {
    flex-direction: row;
    flex-wrap: wrap;
    gap: 20px;
  }

  .topList,
  .charts-row > * {
    flex: 0. 0 30%;
  }
}
</style>