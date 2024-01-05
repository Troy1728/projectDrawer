import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Dimensions,
  Alert,
  KeyboardAvoidingView,
  ScrollView,
} from "react-native";
import React, { useState, useEffect } from "react";
import { FIREBASE_AUTH, db } from "../components/Firebase.jsx";
import { signOut } from "firebase/auth";
import CustomButton from "../atoms/CustomButton";
import {
  collection,
  updateDoc,
  doc,
  getDocs,
  query,
  where,
} from "firebase/firestore";
import stylesFile from "../styles.js";
import LocationConfig from "../components/Location.jsx";

const signOutUser = async () => {
  try {
    await signOut(FIREBASE_AUTH);
    console.log("Gebruiker uitgelogd");
  } catch (error) {
    console.log(error.message);
  }
};

const ProfileScreen = ({ navigation }) => {
  const [userData, setUserData] = useState(null);
  const [firstname, setFirstname] = useState(null);
  const [lastname, setLastname] = useState(null);
  const [email, setEmail] = useState(null);
  const [inputCity, setCity] = useState(null);
  const [inputPostalCode, setPostalCode] = useState(null);
  const [inputStreet, setStreet] = useState(null);
  const [inputHouseNumber, setHouseNumber] = useState(null);

  const {
    isLocationUpdated,
    latitude,
    longitude,
    city,
    postalCode,
    street,
    number,
  } = LocationConfig();

  const getUser = async () => {
    const currentUser = FIREBASE_AUTH.currentUser.uid;
    const data = await getDocs(
      query(collection(db, "users"), where("id", "==", currentUser))
    );
    setUserData(data.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
    setFirstname(data.docs[0].data().firstname);
    setLastname(data.docs[0].data().lastname);
    setEmail(data.docs[0].data().email);
    setCity(data.docs[0].data().location.city);
    setPostalCode(data.docs[0].data().location.postalCode);
    setStreet(data.docs[0].data().location.street);
    setHouseNumber(data.docs[0].data().location.number);
  };

  useEffect(() => {
    getUser();
    if (isLocationUpdated) {
      console.log("Location updated: ", {
        latitude,
        longitude,
        city,
        postalCode,
        street,
        number,
      });
    }
  }, [
    isLocationUpdated,
    latitude,
    longitude,
    city,
    postalCode,
    street,
    number,
  ]);

  const getLocation = async () => {
    Alert.alert(
      "Locatie",
      "Wilt u uw locatie updaten?" +
        "\n" +
        city +
        "\n" +
        postalCode +
        "\n" +
        street +
        "\n" +
        number,
      [
        {
          text: "Annuleren",
          onPress: () => console.log("Cancel Pressed"),
          style: "cancel",
        },
        {
          text: "Ok",
          onPress: () => {
            setCity(city);
            setPostalCode(postalCode);
            setStreet(street);
            setHouseNumber(number);
          },
        },
      ],
      { cancelable: false }
    );
  };

  const updateUser = async () => {
    try {
      const userId = FIREBASE_AUTH.currentUser.uid;
      const userRef = doc(db, "users", userId);
      await updateDoc(userRef, {
        firstname: firstname,
        lastname: lastname,
        location: {
          city: city,
          postalCode: postalCode,
          street: street,
          number: number,
        },
      });

      console.log("Gebruiker geupdate");
      Alert.alert("Gebruiker geupdate");
    } catch (error) {
      console.log(error.message);
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: "#fff" }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView>
        <View style={styles.container}>
          <View style={styles.inputContainer}>
            <Text style={styles.text}>Voornaam</Text>
            <TextInput
              style={stylesFile.input}
              value={firstname}
              onChangeText={(text) => setFirstname(text)}
            />
            <Text style={styles.text}>Achternaam</Text>
            <TextInput
              style={stylesFile.input}
              value={lastname}
              onChangeText={(text) => setLastname(text)}
            />
            <Text style={styles.text}>Email</Text>
            <TextInput
              style={stylesFile.input}
              value={email}
              onChangeText={(text) => setEmail(text)}
              editable={false}
            />
            <Text style={styles.text}>Stad</Text>
            <TextInput
              style={stylesFile.input}
              value={inputCity}
              onChangeText={(text) => setCity(text)}
            />
            <Text style={styles.text}>Postcode</Text>
            <TextInput
              style={stylesFile.input}
              value={inputPostalCode}
              onChangeText={(text) => setPostalCode(text)}
            />
            <Text style={styles.text}>Straat</Text>
            <TextInput
              style={stylesFile.input}
              value={inputStreet}
              onChangeText={(text) => setStreet(text)}
            />
            <Text style={styles.text}>Huisnummer</Text>
            <TextInput
              style={stylesFile.input}
              value={inputHouseNumber}
              onChangeText={(text) => setHouseNumber(text)}
            />
          </View>
        </View>
        <View style={{justifyContent: "center", paddingBottom: 20, paddingLeft: 10, alignContent: "space-between"}}>

        <CustomButton
          title="Vind Locatie"
          buttonDesign="articleButton"
          onPress={getLocation}
        />
        <CustomButton
          title="Aanpassen"
          buttonDesign="fullButton"
          onPress={updateUser}
        />
        <CustomButton
          title="Uitloggen"
          buttonDesign="logoutButton"
          onPress={signOutUser}
        />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default ProfileScreen;

const styles = StyleSheet.create({
  text: {
    fontSize: 20,
    fontWeight: "bold",
  },
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingHorizontal: 20,
    justifyContent: "center",
  },
  inputContainer: {
    marginBottom: 20,
  },
});
