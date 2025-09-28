<template>
    <div class="general-info-container">
      <div class="info-row">
        <div class="info-item">
          <span class="value">{{ peakFlightAltitude }} </span>
          <span class="label">Пиковое значение полетов</span>
        </div>
        <div class="info-item">
          <span class="value">{{ totalFlights }}</span>
          <span class="label">Общее количество полетов</span>
        </div>
        <div class="info-item">
          <span class="value">{{ averageFlightTime }} мин</span>
          <span class="label">Среднее время полета</span>
        </div>
        <div class="info-item">
          <span class="value">{{ flightDensity }} на 1000 км²</span>
          <span class="label">Плотность полетов</span>
        </div>
        <div class="info-item">
          <span class="value">{{ totalDistance }} км</span>
          <span class="label">Общая дистанция</span>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    name: 'GeneralInformation',
    props: {
      peakFlightAltitude: { type: Number, default: 0 },
      totalFlights: { type: Number, default: 0 },
      averageFlightTime: { type: Number, default: 0 },
      flightDensity: { type: Number, default: 0 },
      totalDistance: { type: Number, default: 0 },
    },
  };
  </script>
  
  <style scoped>
  .general-info-container {
    width: 1400px;
    margin-top: 2vh;
    padding: 10px;
  }
  
  .info-row {
    display: flex;
    justify-content: space-between;
    background: #ffffff;
    border-radius: 12px;
    padding: 15px 40px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    flex-wrap: wrap;
    gap: 20px;
  }
  
  .info-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 8px;
  }
  
  .label {
    font-size: 1rem;
    font-weight: 600;
    color: #1f2937;
    font-family: 'Inter', sans-serif;
    text-align: center;
  }
  
  .value {
    font-size: 1.2rem;
    font-weight: 700;
    color: #3b82f6;
  }
  
  @media (max-width: 768px) {
    .general-info-container {
      width: 100%;
    }
  
  
    .info-row {
      flex-direction: column;
      align-items: flex-start;
      padding: 10px 15px;
    }
  
    .info-item {
      width: 100%;
      align-items: flex-start;
    }
  }
  </style>