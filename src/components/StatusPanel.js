import React, { useState, useEffect } from 'react';
import { Wifi, WifiOff, Activity, Clock } from 'lucide-react';
import apiService from '../services/api';
import { useLocation } from '../contexts/LocationContext';

const StatusPanel = () => {
  const { location } = useLocation();
  const [status, setStatus] = useState({
    isOnline: false,
    lastCheck: null,
    message: 'Checking backend status...',
    isLoading: true
  });

  const checkHealth = async () => {
    try {
      setStatus(prev => ({ ...prev, isLoading: true }));
      const response = await apiService.checkHealth();
      setStatus({
        isOnline: true,
        lastCheck: new Date(),
        message: response.message || 'Backend is running and ready!',
        isLoading: false
      });
    } catch (error) {
      setStatus({
        isOnline: false,
        lastCheck: new Date(),
        message: 'Backend is offline or unreachable',
        isLoading: false
      });
    }
  };

  useEffect(() => {
    checkHealth();
    
    // Poll every 15 minutes (900000ms)
    const interval = setInterval(checkHealth, 900000);
    
    return () => clearInterval(interval);
  }, []);

  const getStatusIcon = () => {
    if (status.isLoading) {
      return <Activity size={20} className="text-blue-500 animate-spin" />;
    }
    return status.isOnline ? (
      <Wifi size={20} className="text-green-500" />
    ) : (
      <WifiOff size={20} className="text-red-500" />
    );
  };

  const getStatusColor = () => {
    if (status.isLoading) return 'text-blue-600 dark:text-blue-400';
    return status.isOnline ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400';
  };

  const getBgColor = () => {
    if (status.isLoading) return 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800';
    return status.isOnline ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800' : 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800';
  };

  return (
    <div className={`card p-4 border ${getBgColor()}`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          {getStatusIcon()}
          <div>
            <h3 className="text-sm font-medium text-gray-900 dark:text-white">
              Backend Status
            </h3>
            <p className={`text-xs ${getStatusColor()}`}>
              {status.message}
            </p>
          </div>
        </div>
        <div className="flex items-center space-x-2 text-xs text-gray-500 dark:text-gray-400">
          <Clock size={14} />
          <span>
            {status.lastCheck ? status.lastCheck.toLocaleTimeString() : 'Never'}
          </span>
        </div>
      </div>
      <button
        onClick={checkHealth}
        disabled={status.isLoading}
        className="mt-3 text-xs text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 disabled:opacity-50"
      >
        {status.isLoading ? 'Checking...' : 'Refresh Status'}
      </button>
    </div>
  );
};

export default StatusPanel; 