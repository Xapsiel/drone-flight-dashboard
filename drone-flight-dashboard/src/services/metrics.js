const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080'

export default {
  async getMetrics(regionId, year) {
    const url = `${API_BASE_URL}/metrics?regID=${encodeURIComponent(regionId)}&year=${encodeURIComponent(year)}`
    const res = await fetch(url)
    if (!res.ok) {
      throw new Error(`Failed to fetch metrics: ${res.status} ${res.statusText}`)
    }
    return res.json()
  }
}