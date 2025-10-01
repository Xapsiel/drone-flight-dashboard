<template>
  <div class="user-menu">
    <div class="user-info" @click="toggleMenu">
      <span class="username">{{ user.username || '' }}</span>
      <div class="user-avatar door-icon">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" class="door-svg">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M15 12h.01M3 21h18V3H3v18zM9 21V3"/>
        </svg>
      </div>

      <svg class="dropdown-icon" :class="{ 'rotated': isMenuOpen }" viewBox="0 0 24 24" fill="none" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/>
      </svg>
    </div>

    <div v-if="isMenuOpen" class="dropdown-menu" @click.stop>

      <div class="menu-divider"></div>

      <div class="menu-items">
        <button @click="refreshToken" class="menu-item" :disabled="isRefreshing">
          <svg class="menu-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                  d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/>
          </svg>
          <span v-if="isRefreshing">Обновление...</span>
          <span v-else>Обновить токен</span>
        </button>

        <button @click="handleLogout" class="menu-item logout">
          <svg class="menu-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                  d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/>
          </svg>
          Выйти
        </button>
      </div>
    </div>

    <!-- Overlay для закрытия меню при клике вне его -->
    <div v-if="isMenuOpen" class="menu-overlay" @click="closeMenu"></div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import authService from '../services/auth.js'

const isMenuOpen = ref(false)
const isRefreshing = ref(false)

const user = computed(() => authService.user || {})

const toggleMenu = () => {
  isMenuOpen.value = !isMenuOpen.value
}

const closeMenu = () => {
  isMenuOpen.value = false
}

const getInitials = (username) => {
  if (!username) return 'П'
  return username.charAt(0).toUpperCase()
}

const getRoleClass = (role) => {
  const roleClasses = {
    'admin': 'role-admin',
    'analytics': 'role-analytics',
    'viewer': 'role-viewer'
  }
  return roleClasses[role] || 'role-default'
}

const getRoleDisplayName = (role) => {
  const roleNames = {
    'admin': 'Администратор',
    'analytics': 'Аналитик',
    'viewer': 'Наблюдатель'
  }
  return roleNames[role] || role
}

const refreshToken = async () => {
  isRefreshing.value = true
  try {
    const success = await authService.refreshToken()
    if (success) {
      console.log('Токен успешно обновлен')
    }
  } catch (error) {
    console.error('Ошибка обновления токена:', error)
  } finally {
    isRefreshing.value = false
    closeMenu()
  }
}

const handleLogout = async () => {
  try {
    await authService.logout()
    window.location.reload() // Перезагружаем страницу для полного сброса состояния
  } catch (error) {
    console.error('Ошибка выхода:', error)
    // Даже если произошла ошибка, очищаем локальные данные
    authService.clearAuth()
    window.location.reload()
  }
}

// Закрытие меню при нажатии Escape
const handleKeydown = (event) => {
  if (event.key === 'Escape') {
    closeMenu()
  }
}

onMounted(() => {
  document.addEventListener('keydown', handleKeydown)
})

onUnmounted(() => {
  document.removeEventListener('keydown', handleKeydown)
})
</script>

<style scoped>
.user-menu {
  position: relative;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
  padding: 0.5rem;
  border-radius: 8px;
  transition: background-color 0.2s ease;
}

.user-info:hover {
  background-color: #f3f4f6;
}

.username {
  font-weight: 500;
  color: #374151;
  font-size: 0.9rem;
}

.user-avatar {
  width: 32px;
  height: 32px;
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  font-size: 0.875rem;
}

.door-icon {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background-color 0.3s ease;
}

.door-svg {
  width: 20px;
  height: 20px;
  stroke: #374151; /* обычный цвет (темно-серый) */
  transition: stroke 0.3s ease;
}

.user-info:hover .door-svg {
  stroke: #dc2626; /* красный при наведении */
}

.dropdown-icon {
  width: 16px;
  height: 16px;
  color: #6b7280;
  transition: transform 0.2s ease;
}

.dropdown-icon.rotated {
  transform: rotate(180deg);
}

.dropdown-menu {
  position: absolute;
  top: 100%;
  right: 0;
  background: white;
  border-radius: 12px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.15);
  border: 1px solid #e5e7eb;
  min-width: 280px;
  z-index: 1000;
  margin-top: 0.5rem;
}

.user-details {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1.5rem;
}

.user-avatar-large {
  width: 48px;
  height: 48px;
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  font-size: 1.25rem;
  flex-shrink: 0;
}

.user-data h4 {
  margin: 0 0 0.25rem 0;
  font-size: 1rem;
  font-weight: 600;
  color: #1f2937;
}

.user-data p {
  margin: 0 0 0.75rem 0;
  color: #6b7280;
  font-size: 0.875rem;
}

.user-roles {
  display: flex;
  flex-wrap: wrap;
  gap: 0.25rem;
}

.role-badge {
  padding: 0.125rem 0.5rem;
  border-radius: 4px;
  font-size: 0.75rem;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.025em;
}

.role-admin {
  background: #fef2f2;
  color: #dc2626;
}

.role-analytics {
  background: #eff6ff;
  color: #2563eb;
}

.role-viewer {
  background: #f0fdf4;
  color: #16a34a;
}

.role-default {
  background: #f3f4f6;
  color: #6b7280;
}

.menu-divider {
  height: 1px;
  background: #e5e7eb;
  margin: 0;
}

.menu-items {
  padding: 0.5rem;
}

.menu-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  width: 100%;
  padding: 0.75rem;
  border: none;
  background: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 0.875rem;
  color: #374151;
  transition: background-color 0.2s ease;
  text-align: left;
}

.menu-item:hover:not(:disabled) {
  background: #f3f4f6;
}

.menu-item:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.menu-item.logout {
  color: #dc2626;
}

.menu-item.logout:hover {
  background: #fef2f2;
}

.menu-icon {
  width: 16px;
  height: 16px;
  flex-shrink: 0;
}

.menu-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 999;
}

/* Адаптивность */
@media (max-width: 640px) {
  .dropdown-menu {
    min-width: 260px;
    right: -1rem;
  }
  
  .user-details {
    padding: 1rem;
  }
  
  .username {
    display: none;
  }
}
</style>
