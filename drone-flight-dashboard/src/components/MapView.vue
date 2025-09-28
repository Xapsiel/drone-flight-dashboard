<template>
    <div class="map-view">
      <div class="map-container">
        <h2 class="section-title">Топография</h2>
        <div class="map-wrapper">
          <div id="map" class="map"></div>
        </div>
      </div>
      
      <div class="subjects-panel">
        <h3 class="panel-title">Регионы</h3>
        <div class="search-input-wrapper">
          <svg class="search-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M15.5 14h-.79l-.28-.27A6.471 6.471 0 0 0 16 9.5 6.5 6.5 0 1 0 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z" stroke="currentColor" stroke-width="2" fill="none"/>
          </svg>
          <input 
            type="text" 
            v-model="searchQuery" 
            placeholder="Поиск" 
            class="panel-search"
            @keyup.enter="handleSearch"
          />
        </div>
        
        <div class="subjects-list">
          <div 
            v-for="(region, index) in regions" 
            :key="index"
            :class="['region-item', { active: index === activeRegion }]"
            @click="selectRegion(index)"
          >
            <div class="region-header">
              <div class="flag-icon" :style="{ backgroundColor: region.flagColor }"></div>
              <div class="region-info">
                <div class="region-name">{{ region.name }}</div>
                <div class="region-activity">уровень активности: {{ region.activity }}</div>
              </div>
            </div>
            <div v-if="index === activeRegion" class="region-details">
              <div class="region-stats">
                <div class="stat-item">
                  <div class="stat-value">3</div>
                  <div class="stat-label">активных зон</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  import L from 'leaflet'
  import maplibregl from 'maplibre-gl'
  import '@maplibre/maplibre-gl-leaflet'
  import 'leaflet/dist/leaflet.css'
  import 'maplibre-gl/dist/maplibre-gl.css'
  
  export default {
    name: 'MapView',
    data() {
      return {
        searchQuery: '',
        activeRegion: 0,
        regions: [
          {
            name: 'Краснодарский край',
            activity: '3',
            flagColor: '#00A651'
          },
          {
            name: 'Краснодарский край',
            activity: '3',
            flagColor: '#00A651'
          },
          {
            name: 'Краснодарский край',
            activity: '3',
            flagColor: '#00A651'
          },
          {
            name: 'Краснодарский край',
            activity: '3',
            flagColor: '#00A651'
          },
          {
            name: 'Краснодарский край',
            activity: '3',
            flagColor: '#00A651'
          },
          {
            name: 'Краснодарский край',
            activity: '3',
            flagColor: '#00A651'
          },
          {
            name: 'Краснодарский край',
            activity: '3',
            flagColor: '#00A651'
          },
          {
            name: 'Краснодарский край',
            activity: '3',
            flagColor: '#00A651'
          }
        ],
        map: null,
        markers: []
      }
    },
    mounted() {
      this.initMap()
    },
    beforeUnmount() {
      if (this.map) {
        this.map.remove()
      }
    },
    methods: {
      initMap() {
        // Инициализация карты Leaflet + MapLibre (локальные MVT-тайлы)
        this.map = L.map('map').setView([55.7558, 37.6173], 5) // Центр на Москву

        const style = {
          version: 8,
          sources: {
            rf: {
              type: 'vector',
              tiles: [
                '/tiles/{z}/{x}/{y}.mvt'
              ],
              minzoom: 0,
              maxzoom: 14
            }
          },
          layers: [
            {
              id: 'rf-fill',
              type: 'fill',
              source: 'rf',
              'source-layer': 'regions',
              paint: {
                'fill-color': '#cfe3ff',
                'fill-opacity': 0.6
              }
            },
            {
              id: 'rf-outline',
              type: 'line',
              source: 'rf',
              'source-layer': 'regions',
              paint: {
                'line-color': '#3777ff',
                'line-width': 1
              }
            }
          ]
        }

        L.maplibreGL({
          style,
          maplibreGL: maplibregl
        }).addTo(this.map)
  
        // Добавление маркеров для регионов
        this.addRegionMarkers()
      },
      addRegionMarkers() {
        const markerData = [
          { coords: [45.0355, 38.9753], color: '#00A651' }, // Краснодар
          { coords: [45.0355, 38.9753], color: '#00A651' },
          { coords: [44.5, 34.0], color: '#00A651' }, // Крым
          { coords: [51.5, 46.0], color: '#00A651' }, // Волгоград
          { coords: [47.2, 39.7], color: '#00A651' }, // Ростов
          { coords: [43.0, 43.0], color: '#00A651' }, // Ставрополь
          { coords: [46.3, 44.3], color: '#00A651' }, // Астрахань
          { coords: [48.5, 44.5], color: '#00A651' } // Волгоград
        ]
  
        markerData.forEach((data, index) => {
          const marker = L.circleMarker(data.coords, {
            radius: 8,
            fillColor: data.color,
            color: '#000',
            weight: 2,
            opacity: 1,
            fillOpacity: 0.8
          }).addTo(this.map)
  
          marker.bindPopup(`Регион ${index + 1}`)
          this.markers.push(marker)
        })
      },
      selectRegion(index) {
        this.activeRegion = index
        // Центрирование карты на выбранном регионе
        const regionCoords = [
          [45.0355, 38.9753], // Краснодар
          [45.0355, 38.9753],
          [44.5, 34.0],
          [51.5, 46.0],
          [47.2, 39.7],
          [43.0, 43.0],
          [46.3, 44.3],
          [48.5, 44.5]
        ]
        
        if (regionCoords[index]) {
          this.map.setView(regionCoords[index], 8)
        }
      },
      handleSearch() {
        console.log('Search regions:', this.searchQuery)
        // Логика фильтрации регионов
      }
    }
  }
  </script>
  
  <style scoped>
  .map-view {
    display: flex;
    gap: 24px;
    height: 100%;
    padding: 24px;
    width: 80vw;
    margin-top: 1vh;

  }
  
  .map-container {
    flex: 1;
    background: white;
    border-radius: 12px;
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
    overflow: hidden;    /* Явная высота: позволяет вложенному .map-wrapper и .map занимать место */
    height: calc(100vh - 120px);
  }
  
  .section-title {
    padding: 20px 24px 0;
    font-size: 20px;
    font-weight: 600;
    color: #111827;
    margin: 0;
  }
  
  .map-wrapper {
    height: calc(100% - 60px);
    position: relative;
  }
  
  .map {
    height: 100%;
    width: 100%;
    border-radius: 0 0 12px 12px;
    min-height: 400px; /* запасной вариант */
  }
  
  .subjects-panel {
    width: 320px;
    background: white;
    border-radius: 12px;
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
    display: flex;
    flex-direction: column;
    height: fit-content;
  }
  
  .panel-title {
    padding: 20px 24px 16px;
    font-size: 16px;
    font-weight: 600;
    color: #111827;
    margin: 0;
    border-bottom: 1px solid #e5e7eb;
  }
  
  .search-input-wrapper {
    position: relative;
    margin-top: 2vh;
    padding: 0 24px 16px;
  }
  
  .panel-search {
    width: 100%;
    padding: 8px 12px 8px 36px;
    border: 1px solid #d1d5db;
    border-radius: 6px;
    font-size: 14px;
    outline: none;
  }
  
  .panel-search:focus {
    border-color: #3b82f6;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
  }
  
  .search-icon {
    position: absolute;
    left: 36px;
    top: 36%;
    transform: translateY(-50%);
    width: 16px;
    height: 16px;
    color: #6b7280;
    pointer-events: none;
  }
  
  .subjects-list {
    max-height: 600px;
    overflow-y: auto;
    padding-bottom: 16px;
  }
  
  .region-item {
    cursor: pointer;
    border-radius: 8px;
    margin: 0 24px 8px;
    transition: all 0.2s ease;
    border: 1px solid transparent;
  }
  
  .region-item:hover {
    background-color: #f9fafb;
    border-color: #e5e7eb;
  }
  
  .region-item.active {
    background-color: #eff6ff;
    border-color: #3b82f6;
  }
  
  .region-header {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 12px 16px;
  }
  
  .flag-icon {
    width: 24px;
    height: 16px;
    border-radius: 3px;
  }
  
  .region-info {
    flex: 1;
  }
  
  .region-name {
    font-size: 14px;
    font-weight: 500;
    color: #111827;
    margin: 0 0 4px 0;
  }
  
  .region-activity {
    font-size: 12px;
    color: #6b7280;
  }
  
  .region-details {
    padding: 0 16px 12px 52px;
    background: rgba(59, 130, 246, 0.05);
  }
  
  .region-stats {
    display: flex;
    gap: 16px;
  }
  
  .stat-item {
    display: flex;
    flex-direction: column;
  }
  
  .stat-value {
    font-size: 18px;
    font-weight: 700;
    color: #3b82f6;
  }
  
  .stat-label {
    font-size: 12px;
    color: #6b7280;
  }
  
  /* Скроллбар для списка */
  .subjects-list::-webkit-scrollbar {
    width: 4px;
  }
  
  .subjects-list::-webkit-scrollbar-track {
    background: #f1f5f9;
    border-radius: 2px;
  }
  
  .subjects-list::-webkit-scrollbar-thumb {
    background: #cbd5e1;
    border-radius: 2px;
  }
  
  .subjects-list::-webkit-scrollbar-thumb:hover {
    background: #94a3b8;
  }
  </style>