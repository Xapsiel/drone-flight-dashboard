<template>
  <header class="header">
    <div class="container">
      <div class="header-content">
        
        <div class="user-container">
          <UserMenu />
        </div>
      </div>
    </div>
  </header>
</template>

<script setup>
import { ref } from 'vue'
import UserMenu from './UserMenu.vue'

const searchQuery = ref('')

const handleSearch = () => {
  console.log('Search query:', searchQuery.value)
}
</script>

<style scoped>
.header {
  background-color: #ffffff;
  padding: 1rem 0;
  height: 80px;
}

.container {
  max-width: 1610px;
  margin: 0 auto;
  padding: 0 1rem;
  display: flex;
  align-items: center;
  height: 100%;
}

.header-content {
  display: flex;
  justify-content: right;
  align-items: center;
  width: 100%;
}

.search-container {
  display: flex;
  align-items: center;
  flex-grow: 1;
  max-width: 900px;
  margin: 0 13rem;
}

.search-input-wrapper {
  position: relative;
  width: 100%;
}

.search-input {
  width: 100%;
  padding: 0.5rem 1rem 0.5rem 2.5rem; 
  border: 1px solid #ced4da;
  border-radius: 4px;
  font-size: 1rem;
  outline: none;
}

.search-input:focus {
  border-color: #636569;
}

.search-icon {
  position: absolute;
  left: 0.75rem;
  top: 50%;
  transform: translateY(-50%);
  width: 20px;
  height: 20px;
  fill: #636569;
  pointer-events: none;
}

.user-container {
  display: flex;
  align-items: center;
  gap: 2rem;
}

.nickname {
  font-size: 1rem;
  font-weight: 500;
  color: #333;
}

.user-icon {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  object-fit: cover;
}
</style>