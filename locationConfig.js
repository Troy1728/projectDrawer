/* import React, { useState, useEffect } from 'react';
import { View, Text } from 'react-native';
import * as Location from 'expo-location';

const latitude = null;
const longitude = null;

export default function App() {
  const [location, setLocation] = useState(null);
  const [latitude, setLatitude] = useState(null);
  const [longitude, setLongitude] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setErrorMsg('Permission to access location was denied');
        return;
      }
      let location = await Location.getCurrentPositionAsync({});
      setLocation(location);
      setLatitude(location.coords.latitude);
      setLongitude(location.coords.longitude);
    }) ();
  }, []);

  let text = 'Waiting...';
  if (errorMsg) {
    text = errorMsg
  } else if ( location ) {
    text = JSON.stringify(location);
  }
  
  return (
    <View>
      <Text>{text}</Text>
      <Text>{latitude}</Text>
      <Text>{longitude}</Text>
    </View>
  );
}

export {latitude, longitude};
 */


import React, { useState, useEffect } from 'react';
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