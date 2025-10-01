<template>
  <div class="top-list">
    <header class="header">
      <h1 class="header-title">Топ-10 {{ currentSortLabel }}</h1>
      <div class="controls">
        <select v-model="sortType" class="sort-select" @change="handleSortChange">
          <option value="flight_count">Кол-во полетов</option>
          <option value="flight_frequency">Частота полетов</option>
          <option value="avg_flight_time">Среднее время полета</option>
        </select>
      </div>
    </header>

    <div v-if="loading" class="loading">
      <div class="loading-spinner"></div>
      <p>Загрузка данных...</p>
    </div>

    <div v-else-if="error" class="error">
      <p>{{ error }}</p>
      <button @click="fetchTopData" class="retry-btn">Повторить</button>
    </div>

    <ul v-else class="list">
      <li v-for="(item, index) in topData" :key="index" class="list-item">
        <span class="index">{{ index + 1 }}.</span>
        <span class="region">{{ item.region }}</span>
        <span class="value">{{ formattedValue(item) }}</span>
      </li>
    </ul>
  </div>
</template>

<script>
import { defineComponent, ref, computed, onMounted, watch } from 'vue';
import axios from 'axios';
import authService from '../services/auth.js';

export default defineComponent({
  name: 'TopList',
  props: {
    topListData: {
      type: Array,
      default: () => [],
    },
    sortType: {
      type: String,
      default: 'avg_flight_time' 
    }
  },
  emits: ['update:sortType'],
  setup(props, { emit }) {
    // Явно устанавливаем значение по умолчанию
    const internalSortType = ref(props.sortType || 'avg_flight_time');
    const topData = ref([]);
    const loading = ref(false);
    const error = ref('');
    const allMetricsData = ref([]);

    const updateSortType = (newType) => {
      internalSortType.value = newType;
      emit('update:sortType', newType);
    };

    // Получаем все метрики и преобразуем их в топ
    const fetchTopData = async () => {
      loading.value = true;
      error.value = '';
      
      try {
        let token;
        if (typeof authService.getToken === 'function') {
          token = authService.getToken();
        } else {
          token = localStorage.getItem('auth_token');
        }

        if (!token) {
          throw new Error('No authentication token available');
        }

        console.log('🏁 [TopList] Запрашиваем все метрики...');
        console.log('🏁 [TopList] Текущий критерий:', internalSortType.value);

        const response = await axios.get('http://localhost:8080/metrics/all?year=2025', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        console.log('🏁 [TopList] Получены все метрики:', response.data);

        const data = response.data.data;
        allMetricsData.value = data;

        // Преобразуем данные в топ по выбранному критерию
        processTopData(data);

      } catch (err) {
        console.error('🏁 [TopList] Ошибка получения метрик:', err);
        error.value = 'Не удалось загрузить данные. Попробуйте снова.';
        
        // Fallback на локальные данные
        if (props.topListData.length > 0) {
          processTopData(props.topListData);
          error.value = 'Используются локальные данные';
        } else {
          useFallbackData();
        }
      } finally {
        loading.value = false;
      }
    };

    // Преобразуем сырые данные в топ по выбранному критерию
    const processTopData = (data) => {
      if (!data || !Array.isArray(data)) {
        throw new Error('Invalid data format');
      }

      const processedData = data.map(region => {
        const regionName = region.RegionName || region.region || 'Unknown Region';
        
        // Получаем значение по выбранному критерию
        const value = getValueByCriteria(region, internalSortType.value);
        
        return {
          region: regionName,
          value: value,
          rawData: region // сохраняем сырые данные для отладки
        };
      });

      // Сортируем по убыванию и берем топ-10
      topData.value = processedData
        .sort((a, b) => b.value - a.value)
        .slice(0, 10);

      console.log('🏁 [TopList] Топ-10 данных по критерию', internalSortType.value, ':', topData.value);
    };

    // Получаем значение метрики по критерию
    const getValueByCriteria = (region, criteria) => {
      const criteriaMap = {
        flight_count: region.TotalFlight || region.flights || 0,
        flight_frequency: region.AvgDailyFlights || region.frequency || 0,
        flight_duration: (region.TotalDurationMinutes || region.duration || 0) / 60, // переводим в часы
        avg_flight_time: (region.AvgDurationMinutes || region.avgDuration || 0) / 60 // переводим в часы
      };
      
      const value = criteriaMap[criteria] || 0;
      return Number(value) || 0;
    };

    // Генерация демо-данных если основной запрос не удался
    const useFallbackData = () => {
      const regions = [
        'Москва', 'Республика Крым', 'Санкт-Петербург', 'Краснодарский край',
        'Новосибирская область', 'Ростовская область', 'Свердловская область',
        'Челябинская область', 'Приморский край', 'Республика Татарстан'
      ];

      const multipliers = {
        flight_count: { min: 50, max: 200 },
        flight_frequency: { min: 2, max: 10 },
        flight_duration: { min: 100, max: 500 }, // в часах
        avg_flight_time: { min: 0.5, max: 3 }    // в часах
      };

      const multiplier = multipliers[internalSortType.value] || multipliers.avg_flight_time; // Fallback на среднее время

      topData.value = regions.map((region, index) => {
        const value = multiplier.min + (multiplier.max - multiplier.min) * (1 - index / 10);
        return {
          region,
          value: Number(value.toFixed(1))
        };
      });
      
      console.log('🏁 [TopList] Используются демо-данные для критерия', internalSortType.value);
    };

    const handleSortChange = () => {
      updateSortType(internalSortType.value);
      // Если данные уже загружены, просто пересортируем их
      if (allMetricsData.value.length > 0) {
        processTopData(allMetricsData.value);
      } else if (props.topListData.length > 0) {
        processTopData(props.topListData);
      } else {
        fetchTopData();
      }
    };

    // Следим за изменением sortType из родителя
    watch(() => props.sortType, (newVal) => {
      if (newVal !== internalSortType.value) {
        internalSortType.value = newVal;
        // Принудительно обновляем данные при изменении извне
        if (allMetricsData.value.length > 0) {
          processTopData(allMetricsData.value);
        } else {
          fetchTopData();
        }
      }
    });

    onMounted(() => {
      console.log('🏁 [TopList] Компонент монтирован, критерий по умолчанию:', internalSortType.value);
      // Убедимся, что значение установлено перед загрузкой данных
      if (!internalSortType.value) {
        internalSortType.value = 'avg_flight_time';
        updateSortType('avg_flight_time');
      }
      fetchTopData();
    });

    return {
      sortType: computed({
        get: () => internalSortType.value,
        set: updateSortType
      }),
      topData,
      loading,
      error,
      fetchTopData,
      handleSortChange
    };
  },
  computed: {
    currentSortLabel() {
      const labels = {
        flight_count: 'по количеству полетов',
        flight_frequency: 'по частоте полетов',
        flight_duration: 'по длительности полета',
        avg_flight_time: 'по среднему времени полета'
      };
      return labels[this.sortType] || 'по среднему времени полета'; // Fallback на среднее время
    },
  },
  methods: {
    formattedValue(item) {
      const value = item.value || 0;
      
      switch (this.sortType) {
        case 'flight_count':
          return `${Math.round(value)}`;
        case 'flight_frequency':
          return `${value.toFixed(1)}/день`;
        case 'avg_flight_time':
          return `${value.toFixed(1)} ч`;
        default:
          return value.toFixed(1);
      }
    }
  }
});
</script>

<style scoped>
.top-list {
  width: 100%;
  min-width: 300px;
  max-width: 300px;
  margin: 3vh auto;
  padding: 20px;
  overflow-y: auto;
  max-height: 539px;
  background: #ffffff;
  border-radius: 12px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
}

.header {
  text-align: center;
  margin-bottom: 15px;
}

.header-title {
  font-size: 1.0rem;
  font-weight: 700;
  color: #333;
  font-family: 'Inter', sans-serif;
  margin-bottom: 10px;
}

.controls {
  display: flex;
  justify-content: center;
  gap: 10px;
}

.sort-select {
  padding: 8px 12px;
  border: 1px solid #ddd;
  border-radius: 8px;
  background-color: #fff;
  color: #333;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.3s ease;
  min-width: 230px;
}

.sort-select:focus {
  outline: none;
  border-color: #3b82f6;
  box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.2);
}

.sort-select:hover {
  border-color: #3b82f6;
}

.loading, .error {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px 0;
  text-align: center;
}

.loading-spinner {
  border: 3px solid #f3f3f3;
  border-top: 3px solid #3b82f6;
  border-radius: 50%;
  width: 30px;
  height: 30px;
  animation: spin 1s linear infinite;
  margin-bottom: 10px;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.error {
  color: #dc2626;
}

.retry-btn {
  margin-top: 10px;
  padding: 6px 12px;
  background: #3b82f6;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 14px;
}

.retry-btn:hover {
  background: #2563eb;
}
::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}

::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 4px;
}

::-webkit-scrollbar-thumb {
  background: #c1c1c1;
  border-radius: 4px;
}

::-webkit-scrollbar-thumb:hover {
  background: #a8a8a8;
}
.list {
  list-style: none;
  padding: 0;
}

.list-item {
  display: flex;
  align-items: center;
  padding: 10px;
  border-bottom: 1px solid #eee;
  font-size: 16px;
  color: #444;
}

.list-item:last-child {
  border-bottom: none;
}

.list-item:hover {
  background-color: #f5f5f5;
  transition: background-color 0.3s ease;
}

.index {
  flex: 0 0 auto;
  margin-right: 10px;
  font-weight: 600;
  color: #3b82f6;
}

.region {
  flex: 1;
  text-align: left;
  font-size: 14px;
}

.value {
  flex: 0 0 auto;
  margin-left: auto;
  font-weight: 600;
  color: #1f2937;
}
</style>