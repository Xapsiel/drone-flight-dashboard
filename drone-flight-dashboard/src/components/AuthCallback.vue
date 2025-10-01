<template>
  <div class="auth-callback">
    <div class="callback-container">
      <div class="loading-spinner"></div>
      <h2>Обработка входа...</h2>
      <p>Пожалуйста, подождите, пока мы завершаем процесс аутентификации.</p>
    </div>
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import authService from '../services/auth.js'

onMounted(async () => {
  try {
    const urlParams = new URLSearchParams(window.location.search)
    const token = urlParams.get('token')
    
    if (token) {
      authService.setToken(token)
      await authService.getCurrentUser()
      window.location.href = '/'
    } else {
      window.location.href = '/'
    }
  } catch (error) {
    console.error('Ошибка обработки callback:', error)
    window.location.href = '/'
  }
})
</script>

<style scoped>
.auth-callback {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f9fafb;
}

.callback-container {
  text-align: center;
  padding: 2rem;
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  max-width: 400px;
  width: 100%;
}

.loading-spinner {
  width: 40px;
  height: 40px;
  border: 4px solid #e5e7eb;
  border-top: 4px solid #3b82f6;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin: 0 auto 1.5rem;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

h2 {
  color: #1f2937;
  margin-bottom: 1rem;
}

p {
  color: #6b7280;
  line-height: 1.6;
}
</style>
