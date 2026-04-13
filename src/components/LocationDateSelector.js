import React, { useState } from 'react';
import { MapPin, Calendar, Globe } from 'lucide-react';
import { useLocation } from '../contexts/LocationContext';

const LocationDateSelector = () => {
  const { location, updateLocation, updateDate, getFormattedDate } = useLocation();
  const [isEditing, setIsEditing] = useState(false);
  const [tempLocation, setTempLocation] = useState({
    latitude: location.latitude || '',
    longitude: location.longitude || '',
    locationName: location.locationName || '',
    date: location.date || new Date().toISOString().split('T')[0]
  });

  const handleSave = () => {
    updateLocation({
      latitude: parseFloat(tempLocation.latitude),
      longitude: parseFloat(tempLocation.longitude),
      locationName: tempLocation.locationName
    });
    updateDate(tempLocation.date);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setTempLocation({
      latitude: location.latitude || '',
      longitude: location.longitude || '',
      locationName: location.locationName || '',
      date: location.date || new Date().toISOString().split('T')[0]
    });
    setIsEditing(false);
  };

  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setTempLocation(prev => ({
            ...prev,
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            locationName: 'Current Location'
          }));
        },
        (error) => {
          console.warn('Geolocation error:', error);
        }
      );
    }
  };

  return (
    <div className="card p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          Location & Date Settings
        </h3>
        <button
          onClick={() => setIsEditing(!isEditing)}
          className="text-sm text-primary-600 dark:text-primary-400 hover:underline"
        >
          {isEditing ? 'Cancel' : 'Edit'}
        </button>
      </div>

      {isEditing ? (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="form-label">Location Name</label>
              <input
                type="text"
                value={tempLocation.locationName}
                onChange={(e) => setTempLocation(prev => ({ ...prev, locationName: e.target.value }))}
                className="input-field"
                placeholder="Enter location name"
              />
            </div>
            <div>
              <label className="form-label">Date</label>
              <input
                type="date"
                value={tempLocation.date}
                onChange={(e) => setTempLocation(prev => ({ ...prev, date: e.target.value }))}
                className="input-field"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="form-label">Latitude</label>
              <input
                type="number"
                step="any"
                value={tempLocation.latitude}
                onChange={(e) => setTempLocation(prev => ({ ...prev, latitude: e.target.value }))}
                className="input-field"
                placeholder="40.7128"
              />
            </div>
            <div>
              <label className="form-label">Longitude</label>
              <input
                type="number"
                step="any"
                value={tempLocation.longitude}
                onChange={(e) => setTempLocation(prev => ({ ...prev, longitude: e.target.value }))}
                className="input-field"
                placeholder="-74.0060"
              />
            </div>
          </div>

          <div className="flex space-x-3">
            <button
              onClick={getCurrentLocation}
              className="btn-secondary flex items-center space-x-2"
            >
              <Globe size={16} />
              <span>Get Current Location</span>
            </button>
            <button
              onClick={handleSave}
              className="btn-primary"
            >
              Save
            </button>
            <button
              onClick={handleCancel}
              className="btn-secondary"
            >
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <div className="space-y-3">
          <div className="flex items-center space-x-3">
            <MapPin className="w-5 h-5 text-primary-600 dark:text-primary-400" />
            <div>
              <p className="text-sm font-medium text-gray-900 dark:text-white">
                {location.locationName}
              </p>
              <p className="text-xs text-gray-600 dark:text-gray-400">
                {location.latitude?.toFixed(4)}, {location.longitude?.toFixed(4)}
              </p>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            <Calendar className="w-5 h-5 text-primary-600 dark:text-primary-400" />
            <div>
              <p className="text-sm font-medium text-gray-900 dark:text-white">
                {getFormattedDate()}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LocationDateSelector; 