<template>
  <div class="app-layout">
    <Sidebar />
    
    <div class="main-container">
      <header>
        <Header />
      </header>

    </div>
  </div>
</template>

<script setup>
import Header from './components/Header.vue'
import Sidebar from './components/Sidebar.vue'
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
  margin-left: 280px;
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
  padding-left: 16px;
}

.content-wrapper {
  padding: 24px;
  max-width: 1200px;
  margin: 0 auto;
  width: 100%;
}

@media (max-width: 768px) {
  .main-container {
    margin-left: 0;
  }
  
  .content {
    margin-left: 0;
    padding-left: 0;
  }
}
</style>