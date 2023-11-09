import LocationConfig from './locationConfig.js';
import React, {useEffect} from 'react';
import { View, Text } from 'react-native';

const LocationScreen = () => {
const { isLocationUpdated, latitude, longitude} = LocationConfig();
  useEffect(()=> {
    if (isLocationUpdated) {
      console.log('Location updated')
      console.log(latitude)
      console.log(longitude)
    }
  }, [isLocationUpdated, latitude, longitude])
  
  return (
    <View>
      <Text>latitude: {latitude}</Text>
      <Text>longitude: {longitude}</Text>
    </View>
  )
}

export default LocationScreen;