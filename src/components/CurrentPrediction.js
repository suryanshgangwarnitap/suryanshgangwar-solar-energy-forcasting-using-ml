import React, { useState, useEffect } from 'react';
import { Zap, Thermometer, Sun, Droplets, Clock } from 'lucide-react';
import apiService from '../services/api';
import { useLocation } from '../contexts/LocationContext';

const CurrentPrediction = () => {
  const { location } = useLocation();
  const [prediction, setPrediction] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchCurrentPrediction = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await apiService.getCurrentPrediction(
        location.date,
        location.latitude,
        location.longitude
      );
      setPrediction(data);
    } catch (err) {
      setError('Failed to fetch current prediction');
      console.error('Error fetching current prediction:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCurrentPrediction();
    
    // Refresh every 5 minutes
    const interval = setInterval(fetchCurrentPrediction, 300000);
    return () => clearInterval(interval);
  }, [location.date, location.latitude, location.longitude]);

  if (loading) {
    return (
      <div className="card p-6">
        <div className="flex items-center space-x-3 mb-4">
          <Zap className="w-6 h-6 text-primary-600 dark:text-primary-400" />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Current Prediction</h3>
        </div>
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="card p-6">
        <div className="flex items-center space-x-3 mb-4">
          <Zap className="w-6 h-6 text-red-500" />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Current Prediction</h3>
        </div>
        <div className="text-center py-4">
          <p className="text-red-600 dark:text-red-400 text-sm">{error}</p>
          <button
            onClick={fetchCurrentPrediction}
            className="mt-2 text-xs text-primary-600 dark:text-primary-400 hover:underline"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (!prediction) {
    return null;
  }

  const formatDateTime = (datetime) => {
    try {
      const date = new Date(datetime);
      return date.toLocaleString();
    } catch {
      return datetime;
    }
  };

  return (
    <div className="card p-6">
      <div className="flex items-center space-x-3 mb-4">
        <Zap className="w-6 h-6 text-primary-600 dark:text-primary-400" />
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Current Prediction</h3>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="text-center">
          <div className="flex items-center justify-center w-12 h-12 bg-yellow-100 dark:bg-yellow-900 rounded-lg mb-2 mx-auto">
            <Zap size={24} className="text-yellow-600 dark:text-yellow-400" />
          </div>
          <h4 className="text-2xl font-bold text-gray-900 dark:text-white">
            {prediction.predicted_power?.toFixed(1) || 'N/A'} kW
          </h4>
          <p className="text-sm text-gray-600 dark:text-gray-400">Predicted Power</p>
        </div>

        <div className="text-center">
          <div className="flex items-center justify-center w-12 h-12 bg-red-100 dark:bg-red-900 rounded-lg mb-2 mx-auto">
            <Thermometer size={24} className="text-red-600 dark:text-red-400" />
          </div>
          <h4 className="text-2xl font-bold text-gray-900 dark:text-white">
            {prediction.temperature?.toFixed(1) || 'N/A'}°C
          </h4>
          <p className="text-sm text-gray-600 dark:text-gray-400">Temperature</p>
        </div>

        <div className="text-center">
          <div className="flex items-center justify-center w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-lg mb-2 mx-auto">
            <Sun size={24} className="text-blue-600 dark:text-blue-400" />
          </div>
          <h4 className="text-2xl font-bold text-gray-900 dark:text-white">
            {prediction.irradiance?.toFixed(1) || 'N/A'} W/m²
          </h4>
          <p className="text-sm text-gray-600 dark:text-gray-400">Irradiance</p>
        </div>

        <div className="text-center">
          <div className="flex items-center justify-center w-12 h-12 bg-green-100 dark:bg-green-900 rounded-lg mb-2 mx-auto">
            <Droplets size={24} className="text-green-600 dark:text-green-400" />
          </div>
          <h4 className="text-2xl font-bold text-gray-900 dark:text-white">
            {prediction.humidity || 'N/A'}%
          </h4>
          <p className="text-sm text-gray-600 dark:text-gray-400">Humidity</p>
        </div>
      </div>

      <div className="mt-4 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
        <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
          <Clock size={16} />
          <span>Last updated: {formatDateTime(prediction.datetime)}</span>
        </div>
        <div className="text-xs text-gray-500 dark:text-gray-500 mt-1">
          Source: {prediction.source || 'Unknown'}
        </div>
      </div>
    </div>
  );
};

export default CurrentPrediction; 