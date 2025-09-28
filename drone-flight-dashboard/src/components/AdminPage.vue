<template>
  <div class="admin-page">
    <div class="admin-container">
      <h1 class="admin-title">Панель администратора</h1>
      
      <div class="admin-sections">
        <!-- Секция загрузки файлов -->
        <div class="upload-section">
          <h2 class="section-title">Загрузка файлов</h2>
          
          <div class="file-upload-area" 
               :class="{ 'drag-over': isDragOver }"
               @dragover.prevent="handleDragOver"
               @dragleave.prevent="handleDragLeave"
               @drop.prevent="handleDrop"
               @click="triggerFileInput">
            <div class="upload-content">
              <svg class="upload-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                      d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"/>
              </svg>
              <p class="upload-text">
                Перетащите файлы сюда или <span class="upload-link">выберите файлы</span>
              </p>
              <p class="upload-hint">Поддерживаются файлы: .xlsx</p>
            </div>
          </div>
          
          <input 
            ref="fileInput"
            type="file" 
            multiple 
            accept=".xlsx"
            @change="handleFileSelect"
            style="display: none"
          />
          
          <!-- Список выбранных файлов -->
          <div v-if="selectedFiles.length > 0" class="selected-files">
            <h3 class="files-title">Выбранные файлы:</h3>
            <div class="file-list">
              <div 
                v-for="(file, index) in selectedFiles" 
                :key="index"
                class="file-item"
              >
                <div class="file-info">
                  <span class="file-name">{{ file.name }}</span>
                  <span class="file-size">({{ formatFileSize(file.size) }})</span>
                </div>
                <button 
                  @click="removeFile(index)"
                  class="remove-file-btn"
                  type="button"
                >
                  ✕
                </button>
              </div>
            </div>
          </div>
          
          <!-- Кнопки действий -->
          <div class="upload-actions">
            <button 
              @click="clearFiles"
              class="btn btn-secondary"
              :disabled="selectedFiles.length === 0"
            >
              Очистить
            </button>
            <button 
              @click="uploadFiles"
              class="btn btn-primary"
              :disabled="selectedFiles.length === 0 || isUploading"
            >
              <span v-if="isUploading">Загрузка...</span>
              <span v-else>Загрузить файлы</span>
            </button>
          </div>
        </div>
        
        <!-- Секция управления системой -->
        <div class="system-section">
          <h2 class="section-title">Управление системой</h2>
          
          <div class="system-controls">
            <div class="control-group">
              <label class="control-label">Статус системы:</label>
              <span class="status-indicator" :class="systemStatus">
                {{ systemStatusText }}
              </span>
            </div>
            
            <div class="control-group">
              <button 
                @click="toggleSystemStatus"
                class="btn btn-warning"
              >
                {{ systemStatus === 'active' ? 'Остановить' : 'Запустить' }} систему
              </button>
            </div>
            
            <div class="control-group">
              <button 
                @click="exportData"
                class="btn btn-info"
              >
                Экспорт данных
              </button>
            </div>
          </div>
        </div>
        
        <!-- Секция статистики -->
        <div class="stats-section">
          <h2 class="section-title">Статистика</h2>
          
          <div class="stats-grid">
            <div class="stat-card">
              <div class="stat-value">{{ stats.totalFiles }}</div>
              <div class="stat-label">Всего файлов</div>
            </div>
            <div class="stat-card">
              <div class="stat-value">{{ stats.totalSize }}</div>
              <div class="stat-label">Общий размер</div>
            </div>
            <div class="stat-card">
              <div class="stat-value">{{ stats.lastUpload }}</div>
              <div class="stat-label">Последняя загрузка</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import axios from 'axios'

// Реактивные данные
const selectedFiles = ref([])
const isDragOver = ref(false)
const isUploading = ref(false)
const systemStatus = ref('active')

// Статистика (можно получать с сервера)
const stats = ref({
  totalFiles: 156,
  totalSize: '2.3 ГБ',
  lastUpload: '2 часа назад'
})

// Вычисляемые свойства
const systemStatusText = computed(() => {
  return systemStatus.value === 'active' ? 'Активна' : 'Остановлена'
})

// Методы
const triggerFileInput = () => {
  document.querySelector('input[type="file"]').click()
}

const handleDragOver = (e) => {
  e.preventDefault()
  isDragOver.value = true
}

const handleDragLeave = (e) => {
  e.preventDefault()
  isDragOver.value = false
}

const handleDrop = (e) => {
  e.preventDefault()
  isDragOver.value = false
  
  const files = Array.from(e.dataTransfer.files)
  addFiles(files)
}

const handleFileSelect = (e) => {
  const files = Array.from(e.target.files)
  addFiles(files)
}

const addFiles = (files) => {
  const allowedTypes = [
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
  ]
  
  const validFiles = files.filter(file => {
    const isValidType = allowedTypes.includes(file.type)
    const isValidSize = file.size <= 50 * 1024 * 1024 // 50MB
    
    if (!isValidType) {
      alert(`Файл ${file.name} имеет неподдерживаемый тип. Разрешены только .xlsx`)
    }
    if (!isValidSize) {
      alert(`Файл ${file.name} слишком большой (максимум 50MB)`)
    }
    
    return isValidType && isValidSize
  })
  
  selectedFiles.value.push(...validFiles)
}

const removeFile = (index) => {
  selectedFiles.value.splice(index, 1)
}

const clearFiles = () => {
  selectedFiles.value = []
}

const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Байт'
  
  const k = 1024
  const sizes = ['Байт', 'КБ', 'МБ', 'ГБ']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}
const API_BASE_URL = import.meta.env.VITE_API_URL || '/api'
console.log(API_BASE_URL)
const uploadFiles = async () => {
  if (selectedFiles.value.length === 0) return

  isUploading.value = true

  try {
    for (const file of selectedFiles.value) {
      const formData = new FormData()
      formData.append('file', file)
      formData.append('authorID',1)
          const token = localStorage.getItem('auth_token')
          if (!token) {
            throw new Error('Токен авторизации отсутствует')
          }
      try {
        await axios.post(`http://localhost:8080/crawler/upload`, formData, {
          withCredentials: true
        })
      } catch (error) {
        const status = error.response?.status
        const statusText = error.response?.statusText || error.message
        throw new Error(`Ошибка загрузки файла ${file.name}: ${status || ''} ${statusText || ''}`)
      }
    }
    alert(`Успешно загружено ${selectedFiles.value.length} файлов`)
    clearFiles()
  } catch (error) {
    alert('Ошибка при загрузке файлов')
    console.error('Upload error:', error)
  } finally {
    isUploading.value = false
  }
}

const toggleSystemStatus = () => {
  systemStatus.value = systemStatus.value === 'active' ? 'inactive' : 'active'
  alert(`Система ${systemStatusText.value.toLowerCase()}`)
}

const exportData = () => {
  alert('Функция экспорта данных будет реализована')
}
</script>

<style scoped>
.admin-page {
  padding: 2rem;
  min-height: 100vh;
  background:
    radial-gradient(900px 360px at 5% 20%, rgba(99,102,241,0.12), transparent 60%),
    radial-gradient(900px 360px at 95% 80%, rgba(14,165,233,0.12), transparent 60%),
    linear-gradient(180deg, #f8fafc, #f1f5f9);
}

.admin-container {
  /* Расширяем контейнер до ширины, согласованной с шапкой сайта */
  max-width: 1610px;
  width: 100%;
  margin: 0 auto;
}

.admin-title {
  font-size: 2.2rem;
  font-weight: 800;
  color: #0f172a;
  margin-bottom: 2rem;
  text-align: center;
}

.admin-sections {
  display: grid;
  grid-template-columns: 1fr;
  gap: 2rem;
}

.section-title {
  font-size: 1.5rem;
  font-weight: 700;
  color: #0f172a;
  margin-bottom: 1.25rem;
  padding-bottom: 0.5rem;
  border-bottom: 2px solid #e2e8f0;
}

/* Стили для карточек */
.upload-section,
.system-section,
.stats-section {
  background: #ffffff;
  border-radius: 16px;
  padding: 2rem;
  box-shadow:
    0 12px 24px rgba(17,24,39,0.08),
    inset 0 1px 0 rgba(255,255,255,0.6);
  border: 1px solid rgba(226,232,240,0.8);
}

.file-upload-area {
  border: 2px dashed #cbd5e1;
  border-radius: 12px;
  padding: 3rem 2rem;
  text-align: center;
  cursor: pointer;
  transition: border-color .25s ease, background .25s ease, transform .2s ease;
  background: #f8fafc;
}

.file-upload-area:hover,
.file-upload-area.drag-over {
  border-color: #6366f1;
  background: #eef2ff;
  transform: translateY(-1px);
}

.upload-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
}

.upload-icon {
  width: 52px;
  height: 52px;
  color: #64748b;
}

.upload-text {
  font-size: 1.125rem;
  color: #0f172a;
  margin: 0;
}

.upload-link {
  color: #6366f1;
  text-decoration: underline;
}

.upload-hint {
  font-size: 0.875rem;
  color: #64748b;
  margin: 0;
}

/* Список файлов */
.selected-files {
  margin-top: 2rem;
}

.files-title {
  font-size: 1.125rem;
  font-weight: 700;
  color: #0f172a;
  margin-bottom: 1rem;
}

.file-list {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.file-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.9rem 1rem;
  background: linear-gradient(180deg, #f8fafc, #eef2ff);
  border-radius: 10px;
  border: 1px solid #e2e8f0;
}

.file-info {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.file-name {
  font-weight: 600;
  color: #0f172a;
}

.file-size {
  font-size: 0.875rem;
  color: #64748b;
}

.remove-file-btn {
  background: #ef4444;
  color: white;
  border: none;
  border-radius: 50%;
  width: 26px;
  height: 26px;
  cursor: pointer;
  font-size: 0.875rem;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 8px 16px rgba(239,68,68,0.25);
}

.remove-file-btn:hover {
  background: #dc2626;
}

/* Кнопки */
.upload-actions {
  display: flex;
  gap: 1rem;
  margin-top: 2rem;
  justify-content: flex-end;
}

.btn {
  padding: 0.85rem 1.5rem;
  border: none;
  border-radius: 12px;
  font-weight: 600;
  cursor: pointer;
  transition: transform .2s ease, box-shadow .2s ease, background .2s ease;
}

.btn:disabled {
  opacity: 0.55;
  cursor: not-allowed;
}

.btn-primary {
  background: linear-gradient(135deg, #3b82f6, #6366f1);
  color: white;
  box-shadow: 0 10px 20px rgba(99,102,241,0.25);
}

.btn-primary:hover:not(:disabled) {
  transform: translateY(-1px);
  box-shadow: 0 14px 28px rgba(99,102,241,0.35);
}

.btn-secondary {
  background: #6b7280;
  color: white;
  box-shadow: 0 10px 20px rgba(107,114,128,0.25);
}

.btn-secondary:hover:not(:disabled) {
  transform: translateY(-1px);
  box-shadow: 0 14px 28px rgba(75,85,99,0.35);
}

.btn-warning {
  background: linear-gradient(135deg, #f59e0b, #f97316);
  color: white;
  box-shadow: 0 10px 20px rgba(245,158,11,0.25);
}

.btn-warning:hover {
  transform: translateY(-1px);
  box-shadow: 0 14px 28px rgba(245,158,11,0.35);
}

.btn-info {
  background: linear-gradient(135deg, #06b6d4, #0ea5e9);
  color: white;
  box-shadow: 0 10px 20px rgba(14,165,233,0.25);
}

.btn-info:hover {
  transform: translateY(-1px);
  box-shadow: 0 14px 28px rgba(14,165,233,0.35);
}

/* Секция системы */
.system-controls {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.control-group {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.control-label {
  font-weight: 600;
  color: #0f172a;
  min-width: 140px;
}

.status-indicator {
  padding: 0.35rem 0.85rem;
  border-radius: 999px;
  font-weight: 700;
  font-size: 0.875rem;
}

.status-indicator.active {
  background: #dcfce7;
  color: #166534;
}

.status-indicator.inactive {
  background: #fef2f2;
  color: #991b1b;
}

/* Статистика */
.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 1.5rem;
}

.stat-card {
  text-align: center;
  padding: 1.5rem;
  background: linear-gradient(180deg, #f8fafc, #eef2ff);
  border-radius: 12px;
  border: 1px solid #e2e8f0;
}

.stat-value {
  font-size: 2rem;
  font-weight: 800;
  color: #1e40af;
  margin-bottom: 0.5rem;
}

.stat-label {
  font-size: 0.875rem;
  color: #64748b;
  font-weight: 600;
}

/* Адаптивность */
@media (max-width: 768px) {
  .admin-page {
    padding: 1rem;
  }
  
  .admin-title {
    font-size: 1.8rem;
  }
  
  .upload-actions {
    flex-direction: column;
  }
  
  .control-group {
    flex-direction: column;
    align-items: flex-start;
  }
  
  .stats-grid {
    grid-template-columns: 1fr;
  }
}
</style>
