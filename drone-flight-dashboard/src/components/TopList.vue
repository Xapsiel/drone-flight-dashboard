<template>
    <div class="top-list">
      <h2>Топ-10 по количеству полетов</h2>
      <ul class="list">
        <li v-for="(item, index) in sortedData" :key="index" class="list-item">
          {{ index + 1 }}. {{ item.region }} - {{ item.flights }} 
        </li>
      </ul>
    </div>
  </template>
  
  <script>
  import { defineComponent } from 'vue';
  
  export default defineComponent({
    name: 'TopList',
    props: {
      regionData: {
        type: Array,
        default: () => [],
      },
    },
    data() {
      return {
        defaultRegionData: [
          { region: 'Москва', flights: 150 },
          { region: 'Республика Крым', flights: 120 },
          { region: 'Санкт-Петербург', flights: 95 },
          { region: 'Краснодарский край', flights: 80 },
          { region: 'Новосибирская область', flights: 65 },
          { region: 'Ростовская область', flights: 50 },
          { region: 'Свердловская область', flights: 40 },
          { region: 'Челябинская область', flights: 30 },
          { region: 'Приморский край', flights: 25 },
          { region: 'Республика Татарстан', flights: 15 },
          { region: 'Самарская область', flights: 10 },
          { region: 'Иркутская область', flights: 5 },
        ],
      };
    },
    computed: {
      sortedData() {
        // Use prop data if provided, otherwise use default data
        const data = this.regionData.length > 0 ? this.regionData : this.defaultRegionData;
        // Sort by flights in descending order and take top 10
        return [...data].sort((a, b) => b.flights - a.flights).slice(0, 10);
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
    background: #ffffff;
    border-radius: 12px;
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
  }
  
  h2 {
    text-align: center;
    margin-bottom: 15px;
    color: #333;
  }
  
  .list {
    list-style: none;
    padding: 0;
  }
  
  .list-item {
    display: flex;
    justify-content: space-between;
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
  </style>