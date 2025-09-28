# Пример использования системы аутентификации

## Основные сценарии

### 1. Вход в систему

```javascript
// В компоненте Vue
import authService from '../services/auth.js'

// Проверка статуса аутентификации
if (authService.isAuthenticated) {
  console.log('Пользователь авторизован')
} else {
  console.log('Требуется авторизация')
}

// Инициация входа
const handleLogin = async () => {
  try {
    await authService.login()
  } catch (error) {
    console.error('Ошибка входа:', error)
  }
}
```

### 2. Проверка ролей

```javascript
// Проверка конкретной роли
if (authService.hasRole('admin')) {
  // Показать админские функции
}

// Проверка любой из ролей
if (authService.hasAnyRole(['admin', 'analytics'])) {
  // Доступ к аналитике
}

// Проверка доступа к админской панели
if (authService.canAccessAdmin()) {
  // Разрешить переход в админку
}
```

### 3. Работа с пользователем

```javascript
// Получение информации о пользователе
const user = authService.user
console.log('Имя пользователя:', authService.getUsername())
console.log('Email:', authService.getEmail())
console.log('Роли:', user.roles)
```

### 4. Выход из системы

```javascript
const handleLogout = async () => {
  try {
    await authService.logout()
    // Пользователь будет перенаправлен на страницу входа
  } catch (error) {
    console.error('Ошибка выхода:', error)
  }
}
```

### 5. Обновление токена

```javascript
// Автоматическое обновление токена
const refreshToken = async () => {
  const success = await authService.refreshToken()
  if (success) {
    console.log('Токен обновлен')
  } else {
    console.log('Не удалось обновить токен, требуется повторный вход')
  }
}
```

## Интеграция в компонентах

### Защищенный компонент

```vue
<template>
  <div v-if="canAccess">
    <!-- Контент только для авторизованных пользователей -->
  </div>
  <div v-else>
    <p>Доступ запрещен</p>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import authService from '../services/auth.js'

const canAccess = computed(() => {
  return authService.isAuthenticated && authService.hasRole('admin')
})
</script>
```

### Условное отображение меню

```vue
<template>
  <nav>
    <a href="#" @click="goToDashboard">Главная</a>
    <a href="#" @click="goToAnalytics" v-if="canViewAnalytics">Аналитика</a>
    <a href="#" @click="goToAdmin" v-if="canAccessAdmin">Админка</a>
    <button @click="logout" v-if="isAuthenticated">Выйти</button>
  </nav>
</template>

<script setup>
import { computed } from 'vue'
import authService from '../services/auth.js'

const isAuthenticated = computed(() => authService.isAuthenticated)
const canViewAnalytics = computed(() => authService.hasAnyRole(['admin', 'analytics']))
const canAccessAdmin = computed(() => authService.canAccessAdmin())

const logout = () => authService.logout()
</script>
```

## API запросы с аутентификацией

```javascript
import axios from 'axios'

// Настройка автоматического добавления токена
axios.defaults.headers.common['Authorization'] = `Bearer ${authService.token}`

// Пример API запроса
const fetchUserData = async () => {
  try {
    const response = await axios.get('/user/me')
    return response.data.user
  } catch (error) {
    if (error.response?.status === 401) {
      // Токен недействителен, требуется повторная авторизация
      authService.logout()
    }
    throw error
  }
}
```

## Обработка ошибок

```javascript
// В глобальном обработчике ошибок
window.addEventListener('unhandledrejection', (event) => {
  if (event.reason?.response?.status === 401) {
    // Автоматический выход при недействительном токене
    authService.logout()
  }
})
```
