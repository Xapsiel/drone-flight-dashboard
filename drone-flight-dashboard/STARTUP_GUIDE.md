# Руководство по запуску

## Быстрый старт

### 1. Запуск Backend (Go)

```bash
cd BPLA_dashboard
go run cmd/server/main.go
```

Сервер запустится на http://localhost:8080

### 2. Запуск Frontend (Vue.js)

```bash
cd drone-flight-dashboard
npm run dev
```

Приложение запустится на http://localhost:5173

## Проверка работы

### 1. Откройте браузер
Перейдите на http://localhost:5173

### 2. Должна появиться страница входа
- Если видите белый экран, проверьте консоль браузера (F12)
- Убедитесь, что оба сервера запущены

### 3. Нажмите "Войти в систему"
- Произойдет редирект на Keycloak
- После входа - редирект на `/auth/callback` с токеном
- Автоматический переход в основное приложение

## Устранение проблем

### Проблема: Белый экран
**Решение:**
1. Проверьте консоль браузера (F12)
2. Убедитесь, что backend запущен на порту 8080
3. Убедитесь, что frontend запущен на порту 5173

### Проблема: CORS ошибки
**Решение:**
- Прокси настроен в vite.config.js
- Запросы идут через `/api` на backend

### Проблема: "process is not defined"
**Решение:**
- Используется `import.meta.env` вместо `process.env`
- Уже исправлено в auth.js

### Проблема: Keycloak недоступен
**Решение:**
1. Проверьте доступность http://51.250.101.118:8080
2. Проверьте настройки в config.yaml
3. Убедитесь, что realm и client настроены правильно

## Настройка для разработки

### Backend конфигурация
Файл: `BPLA_dashboard/config/config.yaml`

```yaml
oidc:
  client_id: dashboard
  keycloak_url: http://51.250.101.118:8080
  keycloak_realm: dashboard
  keycloak_secret: GF8jyT7F9u6e9jjYEyFUhpWa7JwUEGyW
  redirect_uri: http://localhost:8080/user/redirect
  jwt_secret: "your-super-secret-jwt-key-change-this-in-production"
```

### Frontend конфигурация
Файл: `drone-flight-dashboard/vite.config.js`
- Прокси настроен для `/api` -> `http://localhost:8080`

## Логи и отладка

### Backend логи
- Логи выводятся в консоль
- Включают информацию о запросах и ошибках

### Frontend логи
- Откройте DevTools (F12)
- Проверьте Console и Network tabs
- Прокси логи выводятся в терминал Vite

## Следующие шаги

1. Настройте Keycloak для вашей среды
2. Создайте пользователей с нужными ролями
3. Протестируйте доступ к админской панели
4. Настройте HTTPS для продакшена
