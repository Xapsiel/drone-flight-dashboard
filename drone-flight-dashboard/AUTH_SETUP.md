# Настройка аутентификации и авторизации

## Обзор

Система аутентификации интегрирована в оба проекта (Go backend и Vue.js frontend) и использует:
- **Keycloak** для OAuth2/OIDC аутентификации
- **JWT токены** для сессий
- **Роли** для авторизации доступа к разным разделам

## Backend (Go)

### Настройка конфигурации

Обновите файл `config/config.yaml`:

```yaml
oidc:
  client_id: dashboard
  keycloak_url: http://your-keycloak-url:8080
  keycloak_realm: your-realm
  keycloak_secret: your-client-secret
  redirect_uri: http://localhost:8080/user/redirect
  jwt_secret: "your-super-secret-jwt-key-change-this-in-production"
  scopes:
    - "openid"
    - "profile"
    - "email"
    - "roles"
```

### API Endpoints

- `GET /user/gen_auth_url` - Получить URL для аутентификации
- `GET /user/redirect` - Обработка callback от Keycloak
- `GET /user/me` - Получить информацию о текущем пользователе
- `POST /user/logout` - Выход из системы
- `POST /user/refresh` - Обновление токена

### Middleware

Используется `RoleMiddleware` для проверки доступа к защищенным эндпоинтам:

```go
district.Use(r.RoleMiddleware("admin", "analytics"))
```

## Frontend (Vue.js)

### Настройка

1. Установите зависимости:
```bash
npm install axios
```

2. Создайте файл `.env`:
```env
VUE_APP_API_URL=http://localhost:8080
VUE_APP_AUTH_ENABLED=true
VUE_APP_LOGIN_REDIRECT_URL=http://localhost:5173/auth/callback
```

### Компоненты

- **LoginPage.vue** - Страница входа в систему
- **UserMenu.vue** - Меню пользователя с информацией и выходом
- **auth.js** - Сервис для работы с аутентификацией

### Использование

```javascript
import authService from './services/auth.js'

// Проверка аутентификации
if (authService.isAuthenticated) {
  // Пользователь авторизован
}

// Проверка роли
if (authService.hasRole('admin')) {
  // Пользователь имеет роль admin
}

// Проверка доступа к админской панели
if (authService.canAccessAdmin()) {
  // Пользователь может получить доступ к админке
}
```

## Роли и доступ

### Доступные роли:
- **admin** - Полный доступ к системе
- **analytics** - Доступ к аналитике и отчетам  
- **viewer** - Просмотр данных

### Ограничения доступа:
- Админская панель доступна только пользователям с ролями `admin` или `analytics`
- API эндпоинты могут быть защищены middleware с проверкой ролей

## Настройка Keycloak

1. Создайте новый realm в Keycloak
2. Создайте клиента с типом "Confidential"
3. Настройте redirect URI: `http://localhost:8080/user/redirect`
4. Создайте роли в realm: `admin`, `analytics`, `viewer`
5. Назначьте роли пользователям

## Безопасность

- JWT токены имеют срок действия (24 часа)
- Токены автоматически обновляются
- HTTP-only cookies для дополнительной безопасности
- Проверка ролей на уровне API

## Развертывание

1. Обновите URL в конфигурации для продакшена
2. Используйте сильный JWT secret
3. Настройте HTTPS для продакшена
4. Обновите redirect URI в Keycloak

## Отладка

Для отладки аутентификации:

1. Проверьте логи backend'а
2. Используйте DevTools в браузере для проверки токенов
3. Проверьте конфигурацию Keycloak
4. Убедитесь, что все URL настроены корректно
