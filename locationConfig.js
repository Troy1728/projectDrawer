import { useState, useEffect } from 'react';
import * as Location from 'expo-location';

let latitude = null;
let longitude = null;

const LocationConfig = () => {
  const [isLocationUpdated, setIsLocationUpdated] = useState(false);

  const updateLocation = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();

      if (status === 'granted') {
        const locationData = await Location.getCurrentPositionAsync({});

        latitude = locationData.coords.latitude;
        longitude = locationData.coords.longitude;

        console.log('Updated location: ', {latitude, longitude});
        setIsLocationUpdated(true);
      } else {
        console.error('Location permission denied');
      }
    }
    catch (error) {
      console.log('Error requesting location permissions: ', error);
    }
  };
  useEffect(() => {
    updateLocation();
  }, []);
  return { isLocationUpdated, latitude, longitude };
};


export default LocationConfig;