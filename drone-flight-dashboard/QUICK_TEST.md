# Быстрый тест аутентификации

## Шаги для тестирования

### 1. Запустите серверы

**Backend:**
```bash
cd BPLA_dashboard
go run cmd/server/main.go
```

**Frontend:**
```bash
cd drone-flight-dashboard
npm run dev
```

### 2. Проверьте доступность эндпоинтов

Откройте в браузере:
- http://localhost:8080/user/gen_auth_url - должен вернуть JSON с URL
- http://localhost:5173 - должен показать страницу входа

### 3. Тест аутентификации

1. Откройте http://localhost:5173
2. Нажмите "Войти в систему"
3. Должен произойти редирект на Keycloak
4. После входа - редирект обратно в приложение

### 4. Проверка в DevTools

Откройте DevTools (F12) и проверьте:
- **Console** - нет ошибок
- **Network** - запросы проходят успешно
- **Application > Local Storage** - есть `auth_token`

## Ожидаемый поток

1. `GET /user/gen_auth_url` → возвращает URL Keycloak
2. Редирект на Keycloak
3. `GET /user/redirect?code=...` → обмен кода на токен
4. Редирект на `/auth/callback?token=...`
5. `GET /auth/callback` → установка cookie и редирект на фронтенд
6. Фронтенд получает токен и загружает пользователя

## Если что-то не работает

### 404 на /auth/callback
- Убедитесь, что backend перезапущен после добавления эндпоинта

### CORS ошибки
- Прокси настроен в vite.config.js
- Запросы должны идти через `/api`

### Keycloak недоступен
- Проверьте http://51.250.101.118:8080
- Проверьте настройки в config.yaml
