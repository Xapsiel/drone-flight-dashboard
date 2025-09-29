import axios from 'axios'

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080'

export default {
  async getMetrics(regionId, year) {
    if (regionId === 0 || regionId === '0' || regionId == null) {
      console.warn('📊 [metrics] Пропуск запроса: regionId=0 или пустой')
      return {}
    }
    const url = `${API_BASE_URL}/metrics`
    const params = { reg_id: encodeURIComponent(regionId), year: encodeURIComponent(year) }

    const startedAt = performance.now()
    console.log(`📊 [metrics] Запрос метрик: regID=${regionId}, year=${year}`)
    console.log(`📊 [metrics] URL: ${url}`)

    try {
      const res = await axios.get(url, {
        params,
        withCredentials: true,
      })
      const duration = Math.round(performance.now() - startedAt)
      console.log(`📊 [metrics] Ответ: status=${res.status}, time=${duration}ms`)
      console.log('📊 [metrics] Заголовки:', res.headers)

      const data = res.data
      console.log('✅ [metrics] Данные получены:', data)
      return data && data.data ? data.data : data
    } catch (err) {
      const status = err.response?.status
      const statusText = err.response?.statusText
      const body = err.response?.data
      console.error('❌ [metrics] Ошибка запроса:', status, statusText, body)
      throw err
    }
  }
}
