<template>
  <div class="login-page">
    <div class="login-container">
      <div class="login-header">
        <img :src="droneLogo" alt="Drone logo" class="logo" />
        <h1 class="title">БПЛА Аналитикс</h1>
        <p class="subtitle">Система мониторинга беспилотных летательных аппаратов</p>
      </div>

      <div class="login-form">
        <div v-if="isLoading" class="loading-state">
          <div class="spinner"></div>
          <p>Выполняется вход в систему...</p>
        </div>

        <div v-else-if="error" class="error-state">
          <div class="error-icon">⚠️</div>
          <h3>Ошибка входа</h3>
          <p>{{ error }}</p>
          <button @click="retryLogin" class="btn btn-primary">
            Попробовать снова
          </button>
        </div>

        <div v-else class="login-actions">
          <h2>Вход в систему</h2>
          <p class="description">
            Для доступа к системе необходимо войти через корпоративный аккаунт
          </p>
          
          <button 
            @click="handleLogin" 
            class="btn btn-primary btn-large"
            :disabled="isLoading"
          >
            <svg class="btn-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                    d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"/>
            </svg>
            Войти в систему
          </button>

          <div class="login-info">
            <h4>Доступные роли:</h4>
            <ul>
              <li><strong>admin</strong> - Полный доступ к системе</li>
              <li><strong>analytics</strong> - Доступ к аналитике и отчетам</li>
              <li><strong>viewer</strong> - Просмотр данных</li>
            </ul>
          </div>
        </div>
      </div>

      <div class="login-footer">
        <p>&copy; 2024 БПЛА Аналитикс. Все права защищены.</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import authService from '../services/auth.js'
import droneLogo from '../assets/images/drone.png'
const isLoading = ref(false)
const error = ref(null)

const handleLogin = async () => {
  console.log('🖱️ [LoginPage] Кнопка "Войти в систему" нажата!')
  isLoading.value = true
  error.value = null
  
  try {
    console.log('🖱️ [LoginPage] Вызываем authService.login()...')
    await authService.login()
    console.log('🖱️ [LoginPage] authService.login() завершен (должен произойти редирект)')
  } catch (err) {
    console.error('❌ [LoginPage] Ошибка в handleLogin:', err)
    error.value = err.message || 'Произошла ошибка при входе в систему'
    isLoading.value = false
  }
}

const retryLogin = () => {
  error.value = null
  handleLogin()
}

// Проверка, не авторизован ли уже пользователь
onMounted(async () => {
  console.log('🏁 [LoginPage] onMounted вызван')
  console.log('🏁 [LoginPage] authService.isAuthenticated:', authService.isAuthenticated)
  
  if (authService.isAuthenticated) {
    console.log('🏁 [LoginPage] Пользователь уже авторизован, получаем данные...')
    try {
      await authService.getCurrentUser()
      console.log('🏁 [LoginPage] Данные пользователя получены, перезагружаем страницу...')
      window.location.reload() // Перезагружаем страницу для перехода в основное приложение
    } catch (err) {
      // Токен недействителен, остаемся на странице входа
      console.log('🏁 [LoginPage] Токен недействителен, требуется повторная авторизация:', err)
    }
  } else {
    console.log('🏁 [LoginPage] Пользователь не авторизован, показываем страницу входа')
  }
})
</script>

<style scoped>
.login-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  background: radial-gradient(1200px 400px at 10% 10%, rgba(59,130,246,0.25), transparent 60%),
              radial-gradient(800px 320px at 90% 80%, rgba(99,102,241,0.25), transparent 60%),
              linear-gradient(135deg, #0ea5e9 0%, #6366f1 50%, #7c3aed 100%);
  position: relative;
  overflow: hidden;
}

.login-page::before,
.login-page::after {
  content: "";
  position: absolute;
  border-radius: 50%;
  filter: blur(80px);
  opacity: 0.35;
}

.login-page::before {
  width: 380px;
  height: 380px;
  background: #60a5fa;
  top: -120px;
  left: -120px;
}

.login-page::after {
  width: 320px;
  height: 320px;
  background: #a78bfa;
  bottom: -100px;
  right: -100px;
}

.login-container {
  background: rgba(255,255,255,0.9);
  backdrop-filter: saturate(120%) blur(14px);
  border-radius: 20px;
  box-shadow:
    0 20px 50px rgba(17, 24, 39, 0.25),
    inset 0 1px 0 rgba(255,255,255,0.6);
  border: 1px solid rgba(226,232,240,0.7);
  padding: 3rem;
  max-width: 520px;
  width: 100%;
  text-align: center;
  transition: transform .25s ease, box-shadow .25s ease;
}

.login-container:hover {
  transform: translateY(-2px);
  box-shadow:
    0 30px 60px rgba(17, 24, 39, 0.3),
    inset 0 1px 0 rgba(255,255,255,0.7);
}

.login-header {
  margin-bottom: 2rem;
}

.logo {
  width: 84px;
  height: 84px;
  margin-bottom: 1rem;
  border-radius: 20px;
  box-shadow: 0 8px 20px rgba(59,130,246,0.35);
}

.title {
  font-size: 2.2rem;
  font-weight: 800;
  color: #0f172a;
  letter-spacing: 0.4px;
  margin-bottom: 0.5rem;
}

.subtitle {
  color: #475569;
  font-size: 1rem;
  margin-bottom: 0;
}

.login-form {
  margin-bottom: 2rem;
}

.loading-state {
  padding: 2rem;
}

.spinner {
  width: 40px;
  height: 40px;
  border: 4px solid #e5e7eb;
  border-top: 4px solid #3b82f6;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin: 0 auto 1rem;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.error-state {
  padding: 2rem;
  color: #dc2626;
}

.error-icon {
  font-size: 3rem;
  margin-bottom: 1rem;
}

.error-state h3 {
  color: #dc2626;
  margin-bottom: 0.5rem;
}

.error-state p {
  color: #6b7280;
  margin-bottom: 1.5rem;
}

.login-actions h2 {
  font-size: 1.6rem;
  font-weight: 700;
  color: #111827;
  margin-bottom: 0.75rem;
}

.description {
  color: #6b7280;
  margin-bottom: 2rem;
  line-height: 1.65;
}

.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 0.9rem 1.6rem;
  border: none;
  border-radius: 12px;
  font-weight: 600;
  cursor: pointer;
  transition: transform .2s ease, box-shadow .2s ease, background .2s ease;
  text-decoration: none;
}

.btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.btn-primary {
  background: linear-gradient(135deg, #3b82f6, #6366f1);
  color: white;
  box-shadow: 0 12px 24px rgba(99,102,241,0.35);
}

.btn-primary:hover:not(:disabled) {
  transform: translateY(-1px);
  box-shadow: 0 16px 30px rgba(99,102,241,0.45);
}

.btn-large {
  padding: 1.05rem 2rem;
  font-size: 1.1rem;
  width: 100%;
  margin-bottom: 2rem;
}

.btn-icon {
  width: 20px;
  height: 20px;
}

.login-info {
  text-align: left;
  background: linear-gradient(180deg, #f8fafc, #eef2ff);
  padding: 1.4rem;
  border-radius: 12px;
  border-left: 4px solid #6366f1;
}

.login-info h4 {
  color: #0f172a;
  font-size: 1rem;
  font-weight: 700;
  margin-bottom: 0.9rem;
}

.login-info ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.login-info li {
  color: #475569;
  margin-bottom: 0.5rem;
  padding-left: 1rem;
  position: relative;
}

.login-info li:before {
  content: "•";
  color: #6366f1;
  position: absolute;
  left: 0;
}

.login-footer {
  border-top: 1px solid #e5e7eb;
  padding-top: 1.5rem;
  color: #64748b;
  font-size: 0.875rem;
}

/* Адаптивность */
@media (max-width: 640px) {
  .login-page {
    padding: 1rem;
  }
  
  .login-container {
    padding: 2rem 1.4rem;
    border-radius: 16px;
  }
  
  .title {
    font-size: 1.6rem;
  }
  
  .btn-large {
    padding: 0.9rem 1.4rem;
    font-size: 1rem;
  }
}

/* --- Overrides: выравнивание по теме основного сайта и ширина --- */
.login-page {
  background: linear-gradient(180deg, #f8fafc, #f1f5f9);
}
.login-page::before,
.login-page::after {
  display: none; /* убираем декоративные пятна для единого стиля */
}
.login-container {
  max-width: 960px; /* растягиваем карточку шире, почти на всю страницу */
  text-align: left; /* как на остальных страницах */
}
.login-header,
.login-actions,
.login-footer {
  text-align: left;
}
.login-actions h2 {
  margin-top: 0.25rem;
}
@media (min-width: 1280px) {
  .login-container { max-width: 1100px; }
}
</style>
