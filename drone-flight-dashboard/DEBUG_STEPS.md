# Отладка аутентификации

## Пошаговая отладка

### 1. Проверьте консоль браузера

Откройте DevTools (F12) и проверьте Console tab. Должны быть логи:

```
Инициализация приложения, токен из URL: null
Текущий токен в localStorage: null
Пользователь не авторизован
```

### 2. Нажмите "Войти в систему"

После нажатия должны появиться логи:
```
Отправка запроса /user/gen_auth_url...
```

### 3. Проверьте Network tab

Должны быть запросы:
- `GET /user/gen_auth_url` - должен вернуть 200
- Редирект на Keycloak

### 4. После входа в Keycloak

Проверьте логи в консоли браузера:
```
Инициализация приложения, токен из URL: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
Токен установлен, isAuthenticated: true
Попытка получить данные пользователя...
Отправка запроса /user/me с токеном: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### 5. Проверьте backend логи

В терминале backend должны быть логи:
```
[INFO] GetCurrentUserHandler called authHeader="Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
[INFO] Token extracted tokenLength=xxx
[INFO] User retrieved successfully username="username" roles=["admin"]
```

## Возможные проблемы

### Проблема: "Токен не найден"
**Решение:** Проверьте, что токен передается в URL после редиректа от Keycloak

### Проблема: "Unauthorized: invalid token"
**Решение:** 
1. Проверьте JWT secret в config.yaml
2. Проверьте, что токен не истек
3. Проверьте формат токена

### Проблема: "Failed to get current user"
**Решение:**
1. Проверьте backend логи
2. Убедитесь, что backend запущен
3. Проверьте CORS настройки

### Проблема: Страница входа показывается после успешной авторизации
**Решение:**
1. Проверьте, что `authService.isAuthenticated` возвращает `true`
2. Проверьте, что `authService.user` не null
3. Проверьте логи в консоли

## Тестовые команды

### Проверка токена в localStorage
```javascript
console.log('Token:', localStorage.getItem('auth_token'))
console.log('Auth service:', window.authService || 'Not available')
```

### Проверка состояния аутентификации
```javascript
// Если authService доступен глобально
if (window.authService) {
  console.log('Is authenticated:', window.authService.isAuthenticated)
  console.log('User:', window.authService.user)
}
```

### Ручная проверка API
```javascript
fetch('/api/user/me', {
  headers: {
    'Authorization': 'Bearer ' + localStorage.getItem('auth_token')
  }
})
.then(r => r.json())
.then(console.log)
```
