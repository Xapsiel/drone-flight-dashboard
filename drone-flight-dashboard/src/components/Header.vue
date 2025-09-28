<template>
  <header class="header">
    <div class="container">
      <div class="header-content">
       
        <div class="search-container">
          <div class="search-input-wrapper">
            <svg class="search-icon" viewBox="0 0 24 24">
              <path d="M15.5 14h-.79l-.28-.27A6.471 6.471 0 0 0 16 9.5 6.5 6.5 0 1 0 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/>
            </svg>
            <input 
              type="text" 
              v-model="searchQuery" 
              placeholder="Введите интересующий раздел" 
              class="search-input"
              @keyup.enter="handleSearch"
            />
          </div>
        </div>
        
        <div class="user-container">
          <span class="nickname">Денис Иващенко</span>
          <img 
            :src="userIcon" 
            alt="User icon" 
            class="user-icon"
          />
        </div>
      </div>
    </div>
  </header>
</template>

<script>
export default {
  name: 'Header',
  data() {
    return {
      searchQuery: '',
      nickname: 'Денис Иващенко',
      userIcon: 'https://via.placeholder.com/40'
    }
  },
  methods: {
    handleSearch() {
      console.log('Search query:', this.searchQuery)
    }
  }
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
  justify-content: space-between;
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