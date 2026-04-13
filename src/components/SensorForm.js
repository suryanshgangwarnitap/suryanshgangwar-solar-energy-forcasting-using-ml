import React, { useState } from 'react';
import { Send, Zap, Thermometer, Sun, Droplets } from 'lucide-react';
import apiService from '../services/api';
import { useLocation } from '../contexts/LocationContext';

const SensorForm = ({ onShowToast }) => {
  const { location } = useLocation();
  const [formData, setFormData] = useState({
    temperature: '',
    irradiance: '',
    humidity: '',
    hr: ''
  });
  const [prediction, setPrediction] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate form data
    const requiredFields = ['temperature', 'irradiance', 'humidity', 'hr'];
    const missingFields = requiredFields.filter(field => !formData[field]);
    
    if (missingFields.length > 0) {
      setError(`Please fill in all required fields: ${missingFields.join(', ')}`);
      onShowToast('Please fill in all required fields', 'error');
      return;
    }

    // Validate hour range
    const hour = parseInt(formData.hr);
    if (hour < 0 || hour > 23) {
      setError('Hour must be between 0 and 23');
      onShowToast('Hour must be between 0 and 23', 'error');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      const sensorData = {
        temperature: parseFloat(formData.temperature),
        irradiance: parseFloat(formData.irradiance),
        humidity: parseInt(formData.humidity),
        hr: hour,
        date: location.date,
        latitude: location.latitude,
        longitude: location.longitude
      };

      const result = await apiService.predictFromSensor(sensorData);
      setPrediction(result);
      onShowToast('Prediction generated successfully!', 'success');
    } catch (err) {
      setError('Failed to generate prediction. Please check your data and try again.');
      onShowToast('Failed to generate prediction', 'error');
      console.error('Error generating prediction:', err);
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      temperature: '',
      irradiance: '',
      humidity: '',
      hr: ''
    });
    setPrediction(null);
    setError(null);
  };

  return (
    <div className="card p-6">
      <div className="flex items-center space-x-3 mb-4">
        <Send className="w-6 h-6 text-primary-600 dark:text-primary-400" />
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Sensor Data Prediction</h3>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="form-label">
              Temperature (°C)
            </label>
            <div className="relative">
              <Thermometer className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
              <input
                type="number"
                step="0.1"
                name="temperature"
                value={formData.temperature}
                onChange={handleInputChange}
                className="input-field pl-10"
                placeholder="25.5"
                required
              />
            </div>
          </div>

          <div>
            <label className="form-label">
              Irradiance (W/m²)
            </label>
            <div className="relative">
              <Sun className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
              <input
                type="number"
                step="0.1"
                name="irradiance"
                value={formData.irradiance}
                onChange={handleInputChange}
                className="input-field pl-10"
                placeholder="300.2"
                required
              />
            </div>
          </div>

          <div>
            <label className="form-label">
              Humidity (%)
            </label>
            <div className="relative">
              <Droplets className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
              <input
                type="number"
                min="0"
                max="100"
                name="humidity"
                value={formData.humidity}
                onChange={handleInputChange}
                className="input-field pl-10"
                placeholder="70"
                required
              />
            </div>
          </div>

          <div>
            <label className="form-label">
              Hour (0-23)
            </label>
            <div className="relative">
              <Zap className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
              <input
                type="number"
                min="0"
                max="23"
                name="hr"
                value={formData.hr}
                onChange={handleInputChange}
                className="input-field pl-10"
                placeholder="14"
                required
              />
            </div>
          </div>
        </div>

        {error && (
          <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
            <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
          </div>
        )}

        <div className="flex space-x-3">
          <button
            type="submit"
            disabled={loading}
            className="btn-primary flex items-center space-x-2"
          >
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                <span>Generating...</span>
              </>
            ) : (
              <>
                <Send size={16} />
                <span>Generate Prediction</span>
              </>
            )}
          </button>
          <button
            type="button"
            onClick={resetForm}
            className="btn-secondary"
          >
            Reset
          </button>
        </div>
      </form>

      {prediction && (
        <div className="mt-6 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
          <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
            Prediction Result
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="text-center">
              <div className="flex items-center justify-center w-12 h-12 bg-yellow-100 dark:bg-yellow-900 rounded-lg mb-2 mx-auto">
                <Zap size={24} className="text-yellow-600 dark:text-yellow-400" />
              </div>
              <h5 className="text-xl font-bold text-gray-900 dark:text-white">
                {prediction.predicted_power?.toFixed(1)} kW
              </h5>
              <p className="text-sm text-gray-600 dark:text-gray-400">Predicted Power</p>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-lg mb-2 mx-auto">
                <Sun size={24} className="text-blue-600 dark:text-blue-400" />
              </div>
              <h5 className="text-lg font-semibold text-gray-900 dark:text-white">
                Hour {prediction.hr}
              </h5>
              <p className="text-sm text-gray-600 dark:text-gray-400">Time Period</p>
            </div>
          </div>
          <div className="mt-3 text-xs text-gray-500 dark:text-gray-500">
            Source: {prediction.source || 'Sensor Data'}
          </div>
        </div>
      )}
    </div>
  );
};

export default SensorForm; 