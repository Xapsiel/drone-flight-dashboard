// Сервис для работы с аутентификацией
import axios from 'axios'

const API_BASE_URL = import.meta.env.VITE_API_URL || '/api'

class AuthService {
  constructor() {
    console.log('🔧 Инициализация AuthService...')
    
    // Получаем токен из localStorage
    this.token = localStorage.getItem('auth_token')
    
    // Если токена нет в localStorage, ищем в cookies
    if (!this.token) {
      console.log('🔧 Все cookies:', document.cookie)
      this.token = this.getCookie('auth_token')
      console.log('🔧 Токен из cookies:', this.token ? 'ЕСТЬ' : 'НЕТ')
      if (this.token) {
        // Сохраняем токен в localStorage для удобства
        localStorage.setItem('auth_token', this.token)
      }
    }
    
    this.user = null
    this.isAuthenticated = !!this.token
    
    if (this.token) {
      console.log('🔧 ПОЛНЫЙ ТОКЕН ПРИ ИНИЦИАЛИЗАЦИИ:', this.token)
    }
    
    console.log('🔧 Настройка axios...')
    console.log('🔧 API_BASE_URL:', API_BASE_URL)
    
    // Настройка axios для автоматического добавления токена
    axios.defaults.baseURL = API_BASE_URL
    axios.defaults.withCredentials = true // Включаем отправку cookies
    if (this.token) {
      console.log('🔧 Токен найден, настраиваем Authorization header')
      axios.defaults.headers.common['Authorization'] = `Bearer ${this.token}`
    } else {
      console.log('🔧 Токен не найден')
    }
    
    console.log('🔧 AuthService инициализирован:', {
      hasToken: !!this.token,
      isAuthenticated: this.isAuthenticated,
      apiBaseUrl: API_BASE_URL
    })
  }

  // Получение URL для аутентификации
  async getAuthURL() {
    try {
      console.log('🌐 [getAuthURL] Отправляем запрос на /user/gen_auth_url...')
      console.log('🌐 [getAuthURL] Полный URL:', axios.defaults.baseURL + '/user/gen_auth_url')
      console.log('🌐 [getAuthURL] Headers:', axios.defaults.headers)
      
      const response = await axios.get('/user/gen_auth_url')
      console.log('🌐 [getAuthURL] Ответ от сервера:', response.status, response.data)
      return response.data.res
    } catch (error) {
      console.error('❌ [getAuthURL] Ошибка получения URL аутентификации:', error)
      console.error('❌ [getAuthURL] Статус ошибки:', error.response?.status)
      console.error('❌ [getAuthURL] Данные ошибки:', error.response?.data)
      console.error('❌ [getAuthURL] Полная ошибка:', error)
      throw error
    }
  }

  // Инициация процесса аутентификации
  async login() {
    try {
      console.log('🚀 [login] Начинаем процесс аутентификации...')
      const authURL = await this.getAuthURL()
      console.log('🚀 [login] Получен URL аутентификации:', authURL)
      console.log('🚀 [login] Выполняем редирект на Keycloak...')
      window.location.href = authURL
    } catch (error) {
      console.error('❌ [login] Ошибка входа:', error)
      throw error
    }
  }

  // Обработка callback от сервера аутентификации
  async handleAuthCallback(token) {
    if (token) {
      this.setToken(token)
      await this.getCurrentUser()
      return true
    }
    return false
  }

  // Получение информации о текущем пользователе
  async getCurrentUser() {
    try {
      if (!this.token) {
        throw new Error('Токен не найден')
      }

      console.log('👤 [getCurrentUser] Отправка запроса /user/me с токеном:', this.token.substring(0, 20) + '...')
      console.log('👤 [getCurrentUser] ПОЛНЫЙ ТОКЕН ДЛЯ ЗАПРОСА:', this.token)
      const response = await axios.get('http://localhost:8080/user/me')
      console.log('👤 [getCurrentUser] Ответ от /user/me:', response.data)
      this.user = response.data.user
      return this.user
    } catch (error) {
      console.error('Ошибка получения данных пользователя:', error)
      console.error('Детали ошибки:', error.response?.data)
      // Не выходим из системы сразу, возможно это временная ошибка
      // this.logout()
      throw error
    }
  }

  // Установка токена
  setToken(token) {
    console.log('🔑 [setToken] Устанавливаем токен...')
    console.log('🔑 [setToken] ПОЛНЫЙ ТОКЕН:', token)
    console.log('🔑 [setToken] Токен (первые 20 символов):', token?.substring(0, 20) + '...')
    
    this.token = token
    this.isAuthenticated = true
    localStorage.setItem('auth_token', token)
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
    axios.defaults.withCredentials = true
    
    console.log('🔑 [setToken] Токен установлен:', {
      hasToken: !!this.token,
      isAuthenticated: this.isAuthenticated,
      tokenLength: token?.length,
      fullToken: token
    })
  }

  // Обновление токена
  async refreshToken() {
    try {
      const response = await axios.post('/user/refresh')
      this.setToken(response.data.token)
      this.user = response.data.user
      return true
    } catch (error) {
      console.error('Ошибка обновления токена:', error)
      this.logout()
      return false
    }
  }

  // Выход из системы
  async logout() {
    try {
      if (this.token) {
        await axios.post('/user/logout')
      }
    } catch (error) {
      console.error('Ошибка выхода:', error)
    } finally {
      this.clearAuth()
    }
  }

  // Очистка данных аутентификации
  clearAuth() {
    console.log('🧹 [clearAuth] Очищаем данные аутентификации...')
    this.token = null
    this.user = null
    this.isAuthenticated = false
    localStorage.removeItem('auth_token')
    delete axios.defaults.headers.common['Authorization']
    axios.defaults.withCredentials = true
    console.log('🧹 [clearAuth] Данные очищены')
  }

  // Проверка роли пользователя
  hasRole(role) {
    return this.user && this.user.roles && this.user.roles.includes(role)
  }

  // Проверка наличия любой из ролей
  hasAnyRole(roles) {
    return roles.some(role => this.user.roles.includes(role))
  }

  // Проверка доступа к админской панели
  canAccessAdmin() {
    return this.hasAnyRole(['admin', 'analytics'])
  }

  // Получение имени пользователя
  getUsername() {
    return this.user ? this.user.username : null
  }

  // Получение email пользователя
  getEmail() {
    return this.user ? this.user.email : null
  }

  // Вспомогательный метод для чтения cookies
  getCookie(name) {
    const value = `; ${document.cookie}`
    const parts = value.split(`; ${name}=`)
    if (parts.length === 2) {
      const cookieValue = parts.pop().split(';').shift()
      console.log('🍪 [getCookie] Найден cookie:', name, '=', cookieValue)
      return cookieValue
    }
    console.log('🍪 [getCookie] Cookie не найден:', name)
    return null
  }
}

// Создаем единственный экземпляр сервиса
const authService = new AuthService()

// Делаем доступным глобально для отладки
if (typeof window !== 'undefined') {
  window.authService = authService
}

export default authService
