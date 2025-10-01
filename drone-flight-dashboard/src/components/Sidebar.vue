<template>
  <aside class="sidebar">
    <div class="sidebar-header">
      <div class="logo">
        <img class="logo-image" :src="drone" alt="Drone logo" />
        <div class="logo-text">
          <span class="logo-top">бпла</span>
          <span class="logo-bottom">аналитикс</span>
        </div>
      </div>
    </div>

    <nav class="sidebar-nav">
      <div class="menu">Меню</div>
      <ul class="nav-list">
        <li class="nav-item" :class="{ active: currentView === 'dashboard' }">
          <a href="#" class="nav-link" @click.prevent="$emit('view-change', 'dashboard')">
            <img class="secondary-image" :src="pin" alt="Pin icon" />
            <span>Доска</span>
          </a>
        </li>
        <li class="nav-item" :class="{ active: currentView === 'topography' }">
          <a href="#" class="nav-link" @click.prevent="$emit('view-change', 'topography')">
            <img class="secondary-image" :src="earth" alt="Pin icon" />
            <span>Топография</span>
          </a>
        </li>
        <li class="nav-item" :class="{ active: currentView === 'analytics' }">
          <a href="#" class="nav-link" @click.prevent="$emit('view-change', 'analytics')">
            <img class="secondary-image" :src="diagram" alt="Diagram icon" />
            <span>Аналитика</span>
          </a>
        </li>
        <li class="nav-item" :class="{ active: currentView === 'admin' }">
          <a href="#" class="nav-link" @click.prevent="$emit('view-change', 'admin')">
            <svg class="secondary-image" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                    d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/>
            </svg>
            <span>Админ</span>
          </a>
        </li>
      </ul>
    </nav>

    <div class="sidebar-footer">
      <div class="footer-section">
        <h3 class="footer-title">Настройки</h3>
        <ul class="footer-list">
          <li class="footer-item">
            <a href="#" class="footer-link">
              <img class="secondary-image" :src="gear" alt="Gear icon" />
              <span>Настройки</span>
            </a>
          </li>
          <li class="footer-item">
            <a href="#" class="footer-link">
              <img class="secondary-image" :src="headset" alt="headset icon" />

              <span>Помощь</span>
            </a>
          </li>
        </ul>
      </div>
    </div>
  </aside>
</template>

<script setup>
  import drone from '@/assets/images/drone.png'
  import pin from '@/assets/images/pin.png'
  import diagram from '@/assets/images/diagram.png'
  import earth from '@/assets/images/earth_icon.svg'
  import gear from '@/assets/images/gear.png'
  import headset from '@/assets/images/headset_icon.svg'
</script>

<style scoped>
.menu {
  color: #636569;
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 24px;
}
.secondary-image{
  height: 25px;
  width: 25px;
}

.sidebar {
  position: fixed;
  left: 0;
  top: 0;
  width: 280px;
  height: 100vh;
  background: #ffffff;
  display: flex;
  flex-direction: column;
  z-index: 1002; 
  overflow-y: auto;
}

.sidebar-header {
  padding: 24px 24px 16px;
}

.logo {
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 18px;
  font-weight: 700;
  color: #111827;
}

.logo-image {
  width: 60px;
  height: 60px;
}

.logo-text {
  display: flex;
  flex-direction: column;
}

.logo-top {
  font-size: 18px;
  font-weight: 700;
}

.logo-bottom {
  font-size: 14px;
  color: #000000;
  font-weight: 700;
}

.sidebar-nav {
  flex: 1;
  padding: 5px 0;
}

.nav-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.nav-item {
  margin-bottom: 4px;
}

.nav-link {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 24px;
  text-decoration: none;
  color: #6b7280;
  font-weight: 500;
  font-size: 14px;
  transition: all 0.2s ease;
  border-radius: 0 16px 16px 0;
}

.nav-link:hover {
  background-color: #f3f4f6;
  color: #374151;
}

.nav-item.active .nav-link {
  background-color: #3b82f6;
  color: white;
}

.nav-icon {
  width: 20px;
  height: 20px;
  flex-shrink: 0;
}

.sidebar-footer {
  padding: 24px;
  background: #f9fafb;
}

.footer-section {
  margin-bottom: 16px;
}

.footer-title {
  font-size: 12px;
  font-weight: 600;
  color: #6b7280;
  text-transform: uppercase;
  margin-bottom: 12px;
  letter-spacing: 0.05em;
}

.footer-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.footer-item {
  margin-bottom: 8px;
}

.footer-link {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 8px 0;
  text-decoration: none;
  color: #6b7280;
  font-size: 14px;
  font-weight: 500;
  transition: color 0.2s ease;
  border-radius: 6px;
}

.footer-link:hover {
  color: #242323;
  background-color: #f3f4f6;

}

.footer-icon {
  width: 16px;
  height: 16px;
  flex-shrink: 0;
}

@media (max-width: 768px) {
  .sidebar {
    transform: translateX(-100%);
    transition: transform 0.3s ease;
  }
  
  .sidebar.open {
    transform: translateX(0);
  }
}
</style>