<template>
  <div class="topo-map">
    <div class="map-container">
      <h2 class="section-title">Карта топографии (РФ)</h2>
      <div class="map-wrapper">
        <div id="rf-map" class="map"></div>
      </div>
    </div>

    <aside class="metrics-panel" v-if="selectedRegion">
      <div class="panel-header">
        <h3 class="panel-title">{{ selectedRegion.name }}</h3>
        <div class="panel-sub">Регион ID: {{ selectedRegion.id }} · {{ year }}</div>
      </div>

      <div v-if="loading" class="loading">Загрузка метрик…</div>
      <div v-else-if="error" class="error">{{ error }}</div>
      <div v-else-if="metrics" class="metrics-grid">
        <div class="metric-item">
          <div class="metric-label">Пиковая нагрузка</div>
          <div class="metric-value">{{ metrics.PeakLoad }}</div>
        </div>
        <div class="metric-item">
          <div class="metric-label">Всего полётов</div>
          <div class="metric-value">{{ metrics.TotalFlight }}</div>
        </div>
        <div class="metric-item">
          <div class="metric-label">Средняя длительность (мин)</div>
          <div class="metric-value">{{ metrics.AvgDurationMinutes }}</div>
        </div>
        <div class="metric-item">
          <div class="metric-label">Плотность полётов</div>
          <div class="metric-value">{{ metrics.FlightDensity }}</div>
        </div>
        <div class="metric-item">
          <div class="metric-label">Среднесуточные полёты</div>
          <div class="metric-value">{{ metrics.AvgDailyFlights }}</div>
        </div>
        <div class="metric-item">
          <div class="metric-label">Медиана суточных полётов</div>
          <div class="metric-value">{{ metrics.MedianDailyFlights }}</div>
        </div>
        <div class="metric-item">
          <div class="metric-label">Всего расстояние (км)</div>
          <div class="metric-value">{{ metrics.TotalDistance }}</div>
        </div>

        <div class="metric-item wide">
          <div class="metric-label">Распределение по времени суток</div>
          <div class="metric-breakdown">
            <span>Утро: {{ metrics.MorningFlights }}</span>
            <span>День: {{ metrics.DayFlights }}</span>
            <span>Вечер: {{ metrics.EveningFlights }}</span>
            <span>Ночь: {{ metrics.NightFlights }}</span>
          </div>
        </div>
      </div>

      <div class="panel-footer">
        <label class="year-label">Год:</label>
        <input type="number" min="2000" :max="new Date().getFullYear()+1" v-model="year" @change="refreshMetrics" class="year-input" />
      </div>
    </aside>
  </div>
</template>

<script>
import L from 'leaflet'
import maplibregl from 'maplibre-gl'
import '@maplibre/maplibre-gl-leaflet'
import 'maplibre-gl/dist/maplibre-gl.css'
import metricsService from '../services/metrics.js'

export default {
  name: 'TopoMap',
  data() {
    return {
      map: null,
      selectedRegion: null,
      metrics: null,
      loading: false,
      error: '',
      year: new Date().getFullYear(),
      // Простейший справочник регионов: координаты для кликабельных маркеров и соответствие regID
      rfRegions: [
        { id: 23, name: 'Краснодарский край', coords: [45.0355, 38.9753] },
        { id: 77, name: 'Москва', coords: [55.7558, 37.6173] },
        { id: 78, name: 'Санкт-Петербург', coords: [59.9311, 30.3609] },
        { id: 66, name: 'Свердловская область', coords: [56.8389, 60.6057] },
        { id: 63, name: 'Самарская область', coords: [53.1959, 50.1000] },
        { id: 34, name: 'Волгоградская область', coords: [48.7080, 44.5133] },
        { id: 61, name: 'Ростовская область', coords: [47.2357, 39.7015] },
        { id: 82, name: 'Республика Крым', coords: [44.9521, 34.1024] }
      ]
    }
  },
  mounted() {
    this.initMap()
  },
  beforeUnmount() {
    if (this.map) this.map.remove()
  },
  methods: {
    initMap() {
      // Центрируем карту на РФ, масштаб ~4-5
      this.map = L.map('rf-map').setView([61.5240, 105.3188], 4)

      // Используем локальный источник тайлов (Vector Tiles .mvt)
      const style = {
        version: 8,
        sources: {
          rf: {
            type: 'vector',
            // Через Vite proxy избегаем CORS: см. vite.config.js -> server.proxy
            tiles: [
              'http://localhost:8080/tiles/{z}/{x}/{y}.mvt'
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
            // ВАЖНО: замените 'regions' на фактическое имя слоя внутри MVT
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

      // Атрибуция для локального источника данных
      this.map.attributionControl.addAttribution('© Local Tiles (MVT)')

      // Добавляем кликабельные маркеры по справочнику регионов
      this.rfRegions.forEach((r) => {
        const marker = L.circleMarker(r.coords, {
          radius: 7,
          fillColor: '#3b82f6',
          color: '#1f2937',
          weight: 1,
          opacity: 1,
          fillOpacity: 0.9
        }).addTo(this.map)

        marker.bindPopup(`${r.name}`)
        marker.on('click', () => this.selectRegion(r))
      })
    },
    async selectRegion(region) {
      this.selectedRegion = region
      this.metrics = null
      this.error = ''
      this.loading = true
      try {
        const data = await metricsService.getMetrics(region.id, this.year)
        this.metrics = data
      } catch (e) {
        this.error = 'Ошибка получения метрик региона'
        console.error(e)
      } finally {
        this.loading = false
      }
    },
    async refreshMetrics() {
      if (!this.selectedRegion) return
      await this.selectRegion(this.selectedRegion)
    }
  }
}
</script>

<style scoped>
.topo-map {
  display: flex;
  gap: 24px;
  height: 100%;
}

.map-container {
  flex: 1;
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  overflow: hidden;
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
}

.metrics-panel {
  width: 360px;
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  height: fit-content;
}

.panel-header {
  padding: 16px 20px 0;
}

.panel-title {
  font-size: 18px;
  font-weight: 700;
  color: #111827;
  margin: 0 0 4px 0;
}
.panel-sub {
  font-size: 12px;
  color: #6b7280;
}

.loading, .error {
  padding: 16px 20px;
  font-size: 14px;
}
.error { color: #ef4444; }

.metrics-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
  padding: 12px 20px 20px;
}

.metric-item {
  padding: 12px;
  border: 1px solid #e5e7eb;
  border-radius: 10px;
  background: linear-gradient(180deg, #f8fafc, #eef2ff);
}
.metric-item.wide {
  grid-column: 1 / -1;
}
.metric-label {
  font-size: 12px;
  color: #6b7280;
}
.metric-value {
  font-size: 18px;
  font-weight: 700;
  color: #3b82f6;
}
.metric-breakdown {
  display: flex;
  flex-wrap: wrap;
  gap: 8px 16px;
  margin-top: 6px;
  font-size: 13px;
  color: #374151;
}

.panel-footer {
  padding: 12px 20px 16px;
  border-top: 1px solid #e5e7eb;
  display: flex;
  align-items: center;
  gap: 8px;
}
.year-label { font-size: 12px; color: #6b7280; }
.year-input {
  width: 110px;
  padding: 6px 8px;
  border: 1px solid #d1d5db;
  border-radius: 6px;
}
</style>
