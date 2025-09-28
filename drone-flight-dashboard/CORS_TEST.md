# Тест CORS

## Проверка работы CORS

### 1. Запуск серверов

```bash
# Backend (в первом терминале)
cd BPLA_dashboard
go run cmd/server/main.go

# Frontend (во втором терминале)  
cd drone-flight-dashboard
npm run dev
```

### 2. Проверка CORS в браузере

Откройте DevTools (F12) и в консоли выполните:

```javascript
fetch('http://localhost:8080/user/gen_auth_url', {
  method: 'GET',
  credentials: 'include',
  headers: {
    'Content-Type': 'application/json'
  }
})
.then(response => response.json())
.then(data => console.log('Success:', data))
.catch(error => console.error('Error:', error));
```

### 3. Ожидаемый результат

Должен вернуться JSON с URL аутентификации:

```json
{
  "res": "http://51.250.101.118:8080/realms/dashboard/protocol/openid-connect/auth?client_id=dashboard&redirect_uri=http%3A%2F%2Flocalhost%3A8080%2Fuser%2Fredirect&response_type=code&scope=openid+profile+email+roles&state=a"
}
```

### 4. Если CORS не работает

Проверьте в Network tab:
- Заголовок `Access-Control-Allow-Origin` должен содержать `http://localhost:5173`
- Заголовок `Access-Control-Allow-Credentials` должен быть `true`

### 5. Альтернативное решение

Если проблемы продолжаются, можно использовать прокси в vite.config.js:

```javascript
export default defineConfig({
  plugins: [vue()],
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:8080',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, '')
      }
    }
  }
})
```

И изменить API_BASE_URL на `/api`.
