const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://127.0.0.1:8000';

class ApiService {
  constructor() {
    this.baseURL = API_BASE_URL;
  }

  async makeRequest(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    console.log('Making API request to:', url);
    console.log('Request config:', config);

    try {
      const response = await fetch(url, config);
      
      console.log('Response status:', response.status);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      console.log('Response data:', data);
      return data;
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  // Health check endpoint - using current prediction as health check
  async checkHealth() {
    try {
      await this.makeRequest('/predict/current');
      return { status: 'ok', message: 'Backend is running and ready!' };
    } catch (error) {
      throw new Error('Backend is offline or unreachable');
    }
  }

  // Get current prediction
  async getCurrentPrediction(date = null, latitude = null, longitude = null) {
    const params = new URLSearchParams();
    if (date) params.append('date', date);
    if (latitude) params.append('latitude', latitude);
    if (longitude) params.append('longitude', longitude);
    
    const queryString = params.toString();
    const endpoint = queryString ? `/predict/current?${queryString}` : '/predict/current';
    return this.makeRequest(endpoint);
  }

  // Get 24-hour forecast
  async getDayForecast(date = null, latitude = null, longitude = null) {
    const params = new URLSearchParams();
    if (date) params.append('date', date);
    if (latitude) params.append('latitude', latitude);
    if (longitude) params.append('longitude', longitude);
    
    const queryString = params.toString();
    const endpoint = queryString ? `/predict/day?${queryString}` : '/predict/day';
    return this.makeRequest(endpoint);
  }

  // Get prediction for specific hour
  async getHourPrediction(hour, date = null, latitude = null, longitude = null) {
    const params = new URLSearchParams();
    params.append('hour', hour);
    if (date) params.append('date', date);
    if (latitude) params.append('latitude', latitude);
    if (longitude) params.append('longitude', longitude);
    
    const endpoint = `/predict/hour?${params.toString()}`;
    return this.makeRequest(endpoint);
  }

  // Send sensor data for prediction
  async predictFromSensor(sensorData) {
    return this.makeRequest('/predict/sensor', {
      method: 'POST',
      body: JSON.stringify(sensorData),
    });
  }
}

export default new ApiService(); 