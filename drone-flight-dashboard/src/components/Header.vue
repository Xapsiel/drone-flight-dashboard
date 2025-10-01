<template>
  <header class="header">
    <div class="container">
      <div class="header-content">
        <!-- Панель фильтров в хедере -->
        <div class="filters-panel">
          <div class="filter-group">
            <label for="region-select">Регион:</label>
            <select 
              id="region-select" 
              :value="selectedRegionId" 
              @change="$emit('region-change', $event.target.value)"
              class="filter-select"
            >
              <option value="all">Все регионы</option>
              <option v-for="(code, id) in idToCodeMap" :key="id" :value="id">
                {{ getRegionName(id) }} ({{ code }})
              </option>
            </select>
          </div>
          
          <div class="filter-group">
            <label for="year-select">Год:</label>
            <select 
              id="year-select" 
              :value="selectedYear" 
              @change="$emit('year-change', parseInt($event.target.value))"
              class="filter-select"
            >
              <option v-for="year in availableYears" :key="year" :value="year">
                {{ year }}
              </option>
            </select>
          </div>
          
          <button class="apply-filters-btn" @click="$emit('apply-filters')">
            Применить
          </button>
        </div>
        
        <div class="user-container">
          <UserMenu />
        </div>
      </div>
    </div>
  </header>
</template>

<script setup>
import UserMenu from './UserMenu.vue'

// Props
defineProps({
  selectedRegionId: {
    type: [String, Number],
    default: 'all'
  },
  selectedYear: {
    type: Number,
    default: 2025
  },
  availableYears: {
    type: Array,
    default: () => [2023, 2024, 2025, 2026]
  }
})

// Emits
defineEmits(['region-change', 'year-change', 'apply-filters'])

const idToCodeMap = {
  3: 'RU-MUR',
  4: 'RU-PER',
  5: 'RU-SVE',
  7: 'RU-VLA',
  8: 'RU-KGD',
  10: 'RU-NGR',
  11: 'RU-CR',
  12: 'RU-SEV',
  15: 'RU-IN',
  16: 'RU-TVE',
  17: 'RU-SAK',
  18: 'RU-KLU',
  19: 'RU-SAM',
  20: 'RU-IVA',
  21: 'RU-ORL',
  22: 'RU-SMO',
  23: 'RU-TUL',
  24: 'RU-CHU',
  25: 'RU-TOM',
  26: 'RU-PRI',
  27: 'RU-KR',
  28: 'RU-ARK',
  29: 'RU-MO',
  30: 'RU-ULY',
  31: 'RU-VGG',
  32: 'RU-AST',
  33: 'RU-KRS',
  34: 'RU-VOR',
  35: 'RU-YAR',
  36: 'RU-NVS',
  37: 'RU-NEN',
  38: 'RU-KO',
  39: 'RU-OMS',
  40: 'RU-BA',
  41: 'RU-ORE',
  42: 'RU-YEV',
  43: 'RU-UD',
  44: 'RU-TA',
  45: 'RU-KL',
  46: 'RU-SPE',
  47: 'RU-NIZ',
  48: 'RU-LEN',
  49: 'RU-KIR',
  50: 'RU-KOS',
  51: 'RU-BRY',
  52: 'RU-PSK',
  53: 'RU-SAR',
  54: 'RU-PNZ',
  55: 'RU-LIP',
  56: 'RU-AMU',
  57: 'RU-SE',
  58: 'RU-DA',
  59: 'RU-CE',
  60: 'RU-KHA',
  61: 'RU-MAG',
  62: 'RU-YAN',
  63: 'RU-KHM',
  64: 'RU-MOS',
  65: 'RU-MOW',
  66: 'RU-STA',
  67: 'RU-ROS',
  68: 'RU-KDA',
  69: 'RU-AD',
  70: 'RU-TAM',
  71: 'RU-RYA',
  72: 'RU-KEM',
  73: 'RU-KK',
  74: 'RU-ALT',
  75: 'RU-AL',
  76: 'RU-ZAB',
  77: 'RU-ME',
  78: 'RU-CU',
  79: 'RU-BEL',
  80: 'RU-SA',
  81: 'RU-KGN',
  82: 'RU-TYU',
  83: 'RU-TY',
  84: 'RU-KYA',
  85: 'RU-BU',
  86: 'RU-IRK',
  87: 'RU-KB',
  88: 'RU-KC',
  2: 'RU-KAM',
  6: 'RU-VLG',
  9: 'RU-CHE',
}

const regionNames = {
  2: 'Камчатский край',
  3: 'Мурманская область',
  4: 'Пермский край',
  5: 'Свердловская область',
  6: 'Вологодская область',
  7: 'Владимирская область',
  8: 'Калининградская область',
  9: 'Челябинская область',
  10: 'Новгородская область',
  11: 'Республика Крым',
  12: 'Севастополь',
  15: 'Ингушетия',
  16: 'Тверская область',
  17: 'Сахалинская область',
  18: 'Калужская область',
  19: 'Самарская область',
  20: 'Ивановская область',
  21: 'Орловская область',
  22: 'Смоленская область',
  23: 'Тульская область',
  24: 'Чукотский АО',
  25: 'Томская область',
  26: 'Приморский край',
  27: 'Краснодарский край',
  28: 'Архангельская область',
  29: 'Республика Мордовия',
  30: 'Ульяновская область',
  31: 'Волгоградская область',
  32: 'Астраханская область',
  33: 'Курская область',
  34: 'Воронежская область',
  35: 'Ярославская область',
  36: 'Новосибирская область',
  37: 'Ненецкий АО',
  38: 'Республика Коми',
  39: 'Омская область',
  40: 'Республика Башкортостан',
  41: 'Оренбургская область',
  42: 'Еврейская АО',
  43: 'Удмуртская Республика',
  44: 'Республика Татарстан',
  45: 'Республика Калмыкия',
  46: 'Санкт-Петербург',
  47: 'Нижегородская область',
  48: 'Ленинградская область',
  49: 'Кировская область',
  50: 'Костромская область',
  51: 'Брянская область',
  52: 'Псковская область',
  53: 'Саратовская область',
  54: 'Пензенская область',
  55: 'Липецкая область',
  56: 'Амурская область',
  57: 'Республика Северная Осетия-Алания',
  58: 'Республика Дагестан',
  59: 'Чеченская Республика',
  60: 'Хабаровский край',
  61: 'Магаданская область',
  62: 'Ямало-Ненецкий АО',
  63: 'Ханты-Мансийский АО',
  64: 'Московская область',
  65: 'Москва',
  66: 'Ставропольский край',
  67: 'Ростовская область',
  68: 'Краснодарский край',
  69: 'Республика Адыгея',
  70: 'Тамбовская область',
  71: 'Рязанская область',
  72: 'Кемеровская область',
  73: 'Красноярский край',
  74: 'Алтайский край',
  75: 'Республика Алтай',
  76: 'Забайкальский край',
  77: 'Республика Марий Эл',
  78: 'Чувашская Республика',
  79: 'Белгородская область',
  80: 'Республика Саха (Якутия)',
  81: 'Курганская область',
  82: 'Тюменская область',
  83: 'Республика Тыва',
  84: 'Камчатский край',
  85: 'Республика Бурятия',
  86: 'Иркутская область',
  87: 'Кабардино-Балкарская Республика',
  88: 'Карачаево-Черкесская Республика'
}

const getRegionName = (regionId) => {
  return regionNames[regionId] || `Регион ${regionId}`
}
</script>

<style scoped>
.header {
  background-color: #ffffff;
  padding: 1rem 0;
  height: 80px;
  border-bottom: 1px solid #e5e7eb;
}

.container {
  max-width: 1610px;
  margin: 0 auto;
  padding: 0 1rem;
  display: flex;
  align-items: center;
  height: 100%;
}

.header-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  gap: 2rem;
}

/* Панель фильтров в хедере */
.filters-panel {
  display: flex;
  gap: 1.5rem;
  align-items: end;
  flex-wrap: wrap;
  flex: 1;
}

.filter-group {
  display: flex;
  gap: 0.5rem;
  min-width: 200px;
}

.filter-group label {
  font-weight: 600;
  color: #374151;
  margin-top: 2px;
  font-size: 1rem;
  white-space: nowrap;
}

.filter-select {
  padding: 0.5rem 0.75rem;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  background: white;
  font-size: 0.875rem;
  color: #374151;
  transition: all 0.2s;
  min-width: 180px;
}

.filter-select:focus {
  outline: none;
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.apply-filters-btn {
  padding: 0.5rem 1.5rem;
  background: #3b82f6;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 0.875rem;
  font-weight: 600;
  height: fit-content;
  transition: background-color 0.2s;
  white-space: nowrap;
}

.apply-filters-btn:hover {
  background: #2563eb;
}

.user-container {
  display: flex;
  align-items: center;
  gap: 2rem;
  margin-left: auto;
}

/* Адаптивность */
@media (max-width: 1200px) {
  .filters-panel {
    gap: 1rem;
  }
  
  .filter-group {
    min-width: 160px;
  }
  
  .filter-select {
    min-width: 150px;
  }
}

@media (max-width: 1024px) {
  .header-content {
    gap: 1rem;
  }
  
  .filters-panel {
    flex-wrap: wrap;
    gap: 1rem;
  }
  
  .filter-group {
    min-width: 140px;
  }
  
  .filter-select {
    min-width: 130px;
  }
}

@media (max-width: 768px) {
  .header {
    height: auto;
    min-height: 80px;
    padding: 0.75rem 0;
  }
  
  .header-content {
    flex-direction: column;
    align-items: stretch;
    gap: 1rem;
  }
  
  .filters-panel {
    flex-direction: column;
    align-items: stretch;
    gap: 0.75rem;
  }
  
  .filter-group {
    min-width: auto;
  }
  
  .filter-select {
    min-width: auto;
    width: 100%;
  }
  
  .apply-filters-btn {
    align-self: flex-start;
    width: auto;
  }
  
  .user-container {
    margin-left: 0;
    justify-content: flex-end;
    width: 100%;
  }
}

@media (max-width: 480px) {
  .container {
    padding: 0 0.75rem;
  }
  
  .header-content {
    gap: 0.75rem;
  }
  
  .filters-panel {
    gap: 0.5rem;
  }
  
  .filter-group label {
    font-size: 0.8rem;
  }
  
  .filter-select {
    font-size: 0.8rem;
    padding: 0.4rem 0.6rem;
  }
  
  .apply-filters-btn {
    padding: 0.4rem 1rem;
    font-size: 0.8rem;
  }
}
</style>