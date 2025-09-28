<template>
  <div class="app-layout">
    <Sidebar />
    
    <div class="main-container">
      <header>
        <Header />
      </header>

      <main class="content">
        <MapView />
      </main>
    </div>
  </div>
</template>

<script setup>
import Header from './components/Header.vue'
import Sidebar from './components/Sidebar.vue'
import MapView from './components/MapView.vue'
</script>

<style scoped>
.app-layout {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  position: relative;
}

.main-container {
  display: flex;
  flex: 1;
  width: 100%;
}

header {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  z-index: 1001;
  background: white;
  border-bottom: 1px solid #e5e7eb;
}

.content {
  flex: 1;
  margin-top: 60px; 
  overflow-y: auto;
  background: #f9fafb;
  padding: 0;
  display: flex;
}

@media (max-width: 768px) {
  .main-container {
    margin-left: 0;
  }
  
  .content {
    margin-left: 0;
    padding: 16px;
  }
}
</style>