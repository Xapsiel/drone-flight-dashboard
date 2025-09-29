<template>
  <div class="top-list">
    <header class="header">
      <h1 class="header-title">Топ-10 {{ sortType === 'flights' ? 'по количеству полетов' : 'по длительности полета' }}</h1>
      <div class="controls">
        <button
          :class="{ active: sortType === 'flights' }"
          @click="sortType = 'flights'"
        >
          По количеству полетов
        </button>
        <button
          :class="{ active: sortType === 'duration' }"
          @click="sortType = 'duration'"
        >
          По длительности полета
        </button>
      </div>
    </header>
    <ul class="list">
      <li v-for="(item, index) in sortedData" :key="index" class="list-item">
        <span class="index">{{ index + 1 }}.</span>
        <span class="region">{{ item.region }}</span>
        <span class="value">{{ sortType === 'flights' ? item.flights : item.duration }} {{ sortType === 'flights' ? '' : 'ч' }}</span>
      </li>
    </ul>
  </div>
</template>

<script>
import { defineComponent, ref } from 'vue';

export default defineComponent({
  name: 'TopList',
  props: {
    regionData: {
      type: Array,
      default: () => [],
    },
  },
  setup() {
    const sortType = ref('flights'); // Тип сортировки по умолчанию

    return { sortType };
  },
  data() {
    return {
      defaultRegionData: [
        { region: 'Москва', flights: 150, duration: 2.5 },
        { region: 'Республика Крым', flights: 120, duration: 3.0 },
        { region: 'Санкт-Петербург', flights: 95, duration: 1.5 },
        { region: 'Краснодарский край', flights: 80, duration: 2.8 },
        { region: 'Новосибирская область', flights: 65, duration: 4.0 },
        { region: 'Ростовская область', flights: 50, duration: 2.2 },
        { region: 'Свердловская область', flights: 40, duration: 3.5 },
        { region: 'Челябинская область', flights: 30, duration: 3.2 },
        { region: 'Приморский край', flights: 25, duration: 7.0 },
        { region: 'Республика Татарстан', flights: 15, duration: 2.0 },
        { region: 'Самарская область', flights: 10, duration: 2.7 },
        { region: 'Иркутская область', flights: 5, duration: 5.5 },
      ],
    };
  },
  computed: {
    sortedData() {
      // Используем данные из пропса, если они есть, иначе defaultRegionData
      const data = this.regionData.length > 0 ? this.regionData : this.defaultRegionData;
      // Сортируем по flights или duration в зависимости от sortType
      return [...data]
        .sort((a, b) => {
          if (this.sortType === 'flights') {
            return b.flights - a.flights;
          } else {
            return b.duration - a.duration;
          }
        })
        .slice(0, 10);
    },
  },
});
</script>

<style scoped>
.top-list {
  width: 100%;
  max-width: 300px;
  margin: 5.5vh auto;
  padding: 20px;
  overflow-y: auto;
  max-height: 440px;
  background: #ffffff;
  border-radius: 12px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
}

.header {
  text-align: center;
  margin-bottom: 15px;
}

.header-title {
  font-size: 1.2rem;
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

.controls button {
  padding: 6px 12px;
  border: none;
  border-radius: 8px;
  background-color: #f5f5f5;
  color: #333;
  font-size: 12px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.controls button.active,
.controls button:hover {
  background-color: #3b82f6;
  color: #fff;
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
}

.region {
  flex: 1;
  text-align: left;
}

.value {
  flex: 0 0 auto;
  margin-left: auto;
}
</style>