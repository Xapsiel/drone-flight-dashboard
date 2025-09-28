<template>
  <div class="map-root">
    <div ref="mapContainer" class="map-container"></div>
    <div v-if="error" class="map-error">
      {{ error }}
    </div>
  </div>
</template>

<script>
import maplibregl from 'maplibre-gl'
import 'maplibre-gl/dist/maplibre-gl.css'

export default {
  name: 'LocalVectorMap',
  props: {
    // Имя слоя внутри MVT (по умолчанию 'regions')
    sourceLayer: { type: String, default: 'regions' },
    // Схема тайлов: 'xyz' или 'tms'
    scheme: { type: String, default: 'xyz' },
    // Центр карты и стартовый зум
    center: { type: Array, default: () => [105.3188, 61.5240] },
    zoom: { type: Number, default: 4 },
  },
  data() {
    return {
      map: null,
      error: '',
    }
  },
  mounted() {
    this.initMap()
  },
  beforeUnmount() {
    if (this.map) {
      this.map.remove()
      this.map = null
    }
  },
  methods: {
    initMap() {
      try {
        const style = {
          version: 8,
          name: 'Local MVT',
          sources: {
            localVector: {
              type: 'vector',
              tiles: [
                'http://localhost:8080/tiles/{z}/{x}/{y}.mvt'
              ],
              minzoom: 0,
              maxzoom: 14,
            }
          },
          layers: [
            {
              id: 'regions-fill',
              type: 'fill',
              source: 'localVector',
              'source-layer': this.sourceLayer,
              paint: {
                'fill-color': '#4E79A7',
                'fill-opacity': 0.35,
              }
            },
            {
              id: 'regions-outline',
              type: 'line',
              source: 'localVector',
              'source-layer': this.sourceLayer,
              paint: {
                'line-color': '#2F4B7C',
                'line-width': 1.0
              }
            }
          ],
          glyphs: 'https://demotiles.maplibre.org/font/{fontstack}/{range}.pbf',
          // Спрайт не обязателен, т.к. символы не используем
        }

        // Поддержка TMS при необходимости
        if (this.scheme === 'tms') {
          style.sources.localVector.scheme = 'tms'
        }

        this.map = new maplibregl.Map({
          container: this.$refs.mapContainer,
          style,
          center: this.center,
          zoom: this.zoom,
          attributionControl: false,
          preserveDrawingBuffer: false,
        })

        // Контролы
        this.map.addControl(new maplibregl.NavigationControl(), 'top-right')
        this.map.addControl(new maplibregl.ScaleControl({ maxWidth: 100, unit: 'metric' }))
        this.map.addControl(new maplibregl.AttributionControl({ compact: true }))
        // Добавим локальную атрибуцию
        this.map.on('load', () => {
          try {
            const ctrl = this.map._controls.find(c => c instanceof maplibregl.AttributionControl)
            if (ctrl) {
              // Нативного API для добавления произвольного текста нет,
              // поэтому подменяем DOM атрибуции после загрузки.
              const el = ctrl._container.querySelector('.maplibregl-ctrl-attrib')
              if (el) {
                el.innerHTML = '© Local Tiles (MVT)'
              }
            }
          } catch (e) {
            // no-op
          }
        })

        // Диагностика тайлов
        this.map.on('load', () => {
          this.checkTileAvailability()
        })

        // Обработка ошибок
        this.map.on('error', (e) => {
          this.error = 'Ошибка карты: ' + (e && e.error ? e.error.message || e.error : 'unknown')
          // Автосброс ошибки через 10 сек, чтобы не мешала
          setTimeout(() => { this.error = '' }, 10000)
        })
      } catch (e) {
        this.error = 'Не удалось инициализировать карту: ' + e.message
      }
    },
    checkTileAvailability() {
      try {
        const center = this.map.getCenter()
        const zoom = Math.floor(this.map.getZoom())
        const latRad = center.lat * Math.PI / 180
        const n = Math.pow(2, zoom)
        const x = Math.floor(((center.lng + 180) / 360) * n)
        const y = Math.floor((1 - Math.log(Math.tan(latRad) + 1 / Math.cos(latRad)) / Math.PI) / 2 * n)
        const url = `http://localhost:8080/tiles/${zoom}/${x}/${y}.mvt`
        fetch(url)
          .then(res => {
            if (!res.ok) throw new Error('Tile failed: ' + res.status)
            return res.arrayBuffer()
          })
          .then(buf => {
            if (buf.byteLength === 0) {
              this.error = 'MVT-тайл пуст. Проверьте source-layer.'
              setTimeout(() => { this.error = '' }, 8000)
            }
          })
          .catch(err => {
            this.error = 'Не удалось загрузить MVT-тайл: ' + err.message
            setTimeout(() => { this.error = '' }, 8000)
          })
      } catch (e) {
        this.error = 'Ошибка диагностики тайлов: ' + e.message
        setTimeout(() => { this.error = '' }, 8000)
      }
    }
  }
}
</script>

<style scoped>
.map-root {
  position: relative;
  width: 100%;
  height: 100%;
}
.map-container {
  width: 100%;
  height: calc(100vh - 100px);
  min-height: 480px;
}
.map-error {
  position: absolute;
  left: 12px;
  bottom: 12px;
  padding: 8px 12px;
  background: rgba(220, 53, 69, 0.9);
  color: #fff;
  font-size: 13px;
  border-radius: 4px;
  box-shadow: 0 2px 6px rgba(0,0,0,0.2);
  pointer-events: none;
}
</style>