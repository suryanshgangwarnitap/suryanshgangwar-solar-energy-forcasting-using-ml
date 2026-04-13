import React, { createContext, useContext, useState, useEffect } from 'react';

const LocationContext = createContext();

export const useLocation = () => {
  const context = useContext(LocationContext);
  if (!context) {
    throw new Error('useLocation must be used within a LocationProvider');
  }
  return context;
};

export const LocationProvider = ({ children }) => {
  const [location, setLocation] = useState({
    latitude: null,
    longitude: null,
    date: new Date().toISOString().split('T')[0], // Today's date in YYYY-MM-DD format
    locationName: 'Default Location'
  });

  const [isLoading, setIsLoading] = useState(false);

  // Get user's current location on component mount
  useEffect(() => {
    if (navigator.geolocation) {
      setIsLoading(true);
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation(prev => ({
            ...prev,
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            locationName: 'Current Location'
          }));
          setIsLoading(false);
        },
        (error) => {
          console.warn('Geolocation error:', error);
          // Set default coordinates (you can change these to your preferred default location)
          setLocation(prev => ({
            ...prev,
            latitude: 40.7128, // New York coordinates as default
            longitude: -74.0060,
            locationName: 'Default Location (New York)'
          }));
          setIsLoading(false);
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 300000 // 5 minutes
        }
      );
    } else {
      // Fallback for browsers that don't support geolocation
      setLocation(prev => ({
        ...prev,
        latitude: 40.7128,
        longitude: -74.0060,
        locationName: 'Default Location (New York)'
      }));
    }
  }, []);

  const updateLocation = (newLocation) => {
    setLocation(prev => ({ ...prev, ...newLocation }));
  };

  const updateDate = (date) => {
    setLocation(prev => ({ ...prev, date }));
  };

  const getFormattedDate = () => {
    const date = new Date(location.date);
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getCoordinates = () => {
    return {
      latitude: location.latitude,
      longitude: location.longitude
    };
  };

  const value = {
    location,
    isLoading,
    updateLocation,
    updateDate,
    getFormattedDate,
    getCoordinates
  };

  return (
    <LocationContext.Provider value={value}>
      {children}
    </LocationContext.Provider>
  );
}; 