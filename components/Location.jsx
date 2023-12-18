import { useState, useEffect } from "react";
import * as Location from "expo-location";
import { set } from "firebase/database";

let latitude = null;
let longitude = null;

const LocationConfig = () => {
  const [isLocationUpdated, setIsLocationUpdated] = useState(false);
  const [city, setCity] = useState(null);
  const [postalCode, setPostalCode] = useState(null);
  const [street, setStreet] = useState(null);
  const [number, setNumber] = useState(null);

  const updateLocation = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();

      if (status === "granted") {
        const locationData = await Location.getCurrentPositionAsync({});

        latitude = locationData.coords.latitude;
        longitude = locationData.coords.longitude;

        console.log("Updated location: ", { latitude, longitude });

        const reverseGeocode = await Location.reverseGeocodeAsync({
          latitude,
          longitude,
        });

        if (reverseGeocode && reverseGeocode.length > 0) {
        //   console.log("reverseGeocode: ", reverseGeocode);
          setCity(reverseGeocode[0].city);
          setPostalCode(reverseGeocode[0].postalCode);
          setStreet(reverseGeocode[0].street);
          setNumber(reverseGeocode[0].streetNumber);
        }

        setIsLocationUpdated(true);
      } else {
        console.error("Location permission denied");
      }
    } catch (error) {
      console.error("Error requesting location permissions: ", error);
    }
  };
  useEffect(() => {
    updateLocation();
  }, []);
  return {
    isLocationUpdated,
    latitude,
    longitude,
    city,
    postalCode,
    street,
    number,
  };
};

export default LocationConfig;
