<template>
  <div class="app-layout">
    <!-- Показываем страницу входа, если пользователь не авторизован -->
    <LoginPage v-if="!isAuthenticated && !isLoading" />
    
    <!-- Показываем основное приложение, если пользователь авторизован -->
    <div v-else-if="isAuthenticated" class="app-layout">
      <Sidebar :current-view="currentView" @view-change="handleViewChange" />
      
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
          <TopoMap v-if="currentView === 'topography'" />
          <AdminPage v-else-if="currentView === 'admin'" />
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


import { ref, computed, onMounted } from 'vue'
import GeneralInformation from './components/GeneralInformation.vue';
import MonthlyGrowth from './components/MonthlyGrowth.vue';
import DailyChart from './components/DailyChart.vue';
import ColumnarGraph from './components/ColumnarGraph.vue';
import GraphZeroDays from './components/GraphZeroDays.vue';
import TopList from './components/TopList.vue';
import Header from './components/Header.vue'
import Sidebar from './components/Sidebar.vue'
import TopoMap from './components/TopoMap.vue'
import AdminPage from './components/AdminPage.vue'
import LoginPage from './components/LoginPage.vue'
import authService from './services/auth.js'

const currentView = ref('dashboard')
const isLoading = ref(true)

const isAuthenticated = computed(() => authService.isAuthenticated)

const handleViewChange = (view) => {
  // Проверяем доступ к админской панели
  if (view === 'admin' && !authService.canAccessAdmin()) {
    alert('У вас нет доступа к админской панели')
    return
  }
  currentView.value = view
}

// Инициализация приложения
onMounted(async () => {
  try {
    console.log('🏁 [App] Инициализация приложения...')
    console.log('🏁 [App] URL:', window.location.href)
    console.log('🏁 [App] Search params:', window.location.search)
    
    // Проверяем, есть ли токен в URL (callback от Keycloak)
    const urlParams = new URLSearchParams(window.location.search)
    const token = urlParams.get('token')
    
    console.log('🏁 [App] Токен из URL:', token ? 'ЕСТЬ' : 'НЕТ')
    if (token) {
      console.log('🏁 [App] ПОЛНЫЙ ТОКЕН ИЗ URL:', token)
      console.log('🏁 [App] Токен (первые 20 символов):', token.substring(0, 20) + '...')
    }
    const storedToken = localStorage.getItem('auth_token')
    console.log('🏁 [App] Токен в localStorage:', storedToken ? 'ЕСТЬ' : 'НЕТ')
    if (storedToken) {
      console.log('🏁 [App] ПОЛНЫЙ ТОКЕН В LOCALSTORAGE:', storedToken)
    }
    
    // Проверяем cookies
    console.log('🏁 [App] Все cookies:', document.cookie)
    const cookieToken = document.cookie.split(';').find(cookie => cookie.trim().startsWith('auth_token='))
    if (cookieToken) {
      const tokenValue = cookieToken.split('=')[1]
      console.log('🏁 [App] Токен в cookies:', tokenValue ? 'ЕСТЬ' : 'НЕТ')
      if (tokenValue) {
        console.log('🏁 [App] ПОЛНЫЙ ТОКЕН В COOKIES:', tokenValue)
      }
    } else {
      console.log('🏁 [App] Токен в cookies: НЕТ')
    }
    
    if (token) {
      console.log('🏁 [App] Устанавливаем токен из URL...')
      // Устанавливаем токен из URL
      authService.setToken(token)
      console.log('🏁 [App] Токен установлен, isAuthenticated:', authService.isAuthenticated)
      // Очищаем URL от токена
      window.history.replaceState({}, document.title, window.location.pathname)
      console.log('🏁 [App] URL очищен от токена')
    }
    
    if (authService.isAuthenticated) {
      console.log('🏁 [App] Пользователь авторизован, получаем данные...')
      try {
        await authService.getCurrentUser()
        console.log('🏁 [App] Пользователь получен:', authService.user)
      } catch (userError) {
        console.error('🏁 [App] Ошибка получения пользователя:', userError)
        // Не выходим из системы при ошибке, возможно токен еще не готов
      }
    } else {
      console.log('🏁 [App] Пользователь НЕ авторизован')
    }
    
    console.log('🏁 [App] Инициализация завершена:', {
      isAuthenticated: authService.isAuthenticated,
      hasUser: !!authService.user,
      currentView: currentView.value
    })
  } catch (error) {
    console.error('🏁 [App] Ошибка инициализации:', error)
  } finally {
    console.log('🏁 [App] Устанавливаем isLoading = false')
    isLoading.value = false
  }
})
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
  /* Сдвигаем шапку вправо, чтобы она не перекрывала фиксированный Sidebar */
  left: 280px;
  width: calc(100% - 280px);
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