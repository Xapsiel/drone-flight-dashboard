<template>
  <div class="map-wrapper">
    <div ref="mapContainer" class="map-container"></div>
    <div v-if="errorMessage" class="error-banner">{{ errorMessage }}</div>
  </div>
  </template>

<script setup>
import { onMounted, onBeforeUnmount, ref, watch } from 'vue'
import maplibregl from 'maplibre-gl'

const props = defineProps({
  // Порядок x/y/z соответствует требованию: /tiles/{x}/{y}/{z}.mkv
  center: { type: Array, default: () => [37.6173, 55.7558] }, // [lng, lat] Москва
  zoom: { type: Number, default: 9 },
  minzoom: { type: Number, default: 0 },
  maxzoom: { type: Number, default: 14 },
  sourceLayer: { type: String, default: 'regions' },
})

const mapContainer = ref(null)
let map = null
const errorMessage = ref('')

const TILE_URL = 'http://localhost:8080/tiles/{x}/{y}/{z}.mkv'

function initMap() {
  try {
    map = new maplibregl.Map({
      container: mapContainer.value,
      style: {
        version: 8,
        sources: {
          localVector: {
            type: 'vector',
            tiles: [TILE_URL],
            minzoom: props.minzoom,
            maxzoom: props.maxzoom,
          },
        },
        layers: [
          {
            id: 'regions-fill',
            type: 'fill',
            source: 'localVector',
            'source-layer': props.sourceLayer,
            paint: {
              'fill-color': '#3b82f6',
              'fill-opacity': 0.3,
            },
          },
          {
            id: 'regions-outline',
            type: 'line',
            source: 'localVector',
            'source-layer': props.sourceLayer,
            paint: {
              'line-color': '#1f2937',
              'line-width': 1,
            },
          },
        ],
      },
      center: props.center,
      zoom: props.zoom,
      attributionControl: false,
    })

    map.addControl(new maplibregl.NavigationControl({ visualizePitch: true }), 'top-right')
    map.addControl(new maplibregl.ScaleControl({ unit: 'metric' }))

    map.on('error', (e) => {
      console.error('MapLibre error:', e?.error || e)
      if (!errorMessage.value) errorMessage.value = 'Ошибка инициализации карты.'
    })

    map.on('data', (e) => {
      if (e.dataType === 'source' && e.sourceId === 'localVector') {
        // Простейшая диагностика: если векторные тайлы пустые
        const style = map.getStyle()
        const layerIds = style.layers?.map(l => l.id) || []
        if (!layerIds.includes('regions-fill')) {
          console.warn('Отсутствуют слои рендера: regions-fill')
        }
      }
    })

    // Диагностика загрузки тайла
    map.on('styledata', () => {
      // Пробуем запросить один тайл и проверить ответ
      const testUrl = TILE_URL
        .replace('{x}', '0')
        .replace('{y}', '0')
        .replace('{z}', '0')
      fetch(testUrl)
        .then(resp => {
          if (!resp.ok) throw new Error('Tile HTTP ' + resp.status)
          return resp.arrayBuffer()
        })
        .then(buf => {
          if (!buf || buf.byteLength === 0) {
            errorMessage.value = 'Источник тайлов вернул пустой ответ.'
          }
        })
        .catch(err => {
          console.error('Ошибка загрузки тестового тайла:', err)
          errorMessage.value = 'Не удаётся загрузить тайлы по адресу ' + TILE_URL
        })
    })
  } catch (err) {
    console.error('Ошибка создания карты:', err)
    errorMessage.value = 'Не удалось создать карту.'
  }
}

onMounted(() => {
  initMap()
})

onBeforeUnmount(() => {
  if (map) {
    map.remove()
    map = null
  }
})

// Реакция на изменение центра/зум
watch(() => props.center, (c) => {
  if (map && Array.isArray(c) && c.length === 2) {
    map.setCenter(c)
  }
})
watch(() => props.zoom, (z) => {
  if (map && typeof z === 'number') {
    map.setZoom(z)
  }
})
</script>

<style scoped>
.map-wrapper {
  position: relative;
  height: 70vh;
  min-height: 480px;
  width: 100%;
}
.map-container {
  position: absolute;
  inset: 0;
}
.error-banner {
  position: absolute;
  left: 12px;
  bottom: 12px;
  background: #fee2e2;
  color: #b91c1c;
  padding: 8px 12px;
  border-radius: 6px;
  box-shadow: 0 2px 6px rgba(0,0,0,0.08);
  font-size: 12px;
}
</style>