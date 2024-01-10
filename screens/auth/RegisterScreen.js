import { StatusBar } from "expo-status-bar";
import React, { useState, useEffect } from "react";
import {
  Text,
  View,
  TextInput,
  StyleSheet,
  Dimensions,
  ActivityIndicator,
} from "react-native";
// import { get, ref, set } from "firebase/database";
import { collection, doc, setDoc } from "firebase/firestore";
import { db } from "../../components/Firebase.jsx";
import { createUserWithEmailAndPassword } from "firebase/auth";
import CustomButton from "../../atoms/CustomButton";
import stylesFile from "../../styles/styles.js";
import * as Crypto from "expo-crypto";
import { FIREBASE_AUTH } from "../../components/Firebase.jsx";
import LocationConfig from "../../components/Location.jsx";

const hashPassword = async (password) => {
  const digest = await Crypto.digestStringAsync(
    Crypto.CryptoDigestAlgorithm.SHA256,
    password
  );
  return digest;
};

export default function Register({ navigation }) {
  const [loading, setLoading] = useState(false);
  const [firstName, setFirstName] = useState("");
  const [firstNameError, setFirstNameError] = useState("");

  const [lastName, setLastName] = useState("");
  const [lastNameError, setLastNameError] = useState("");

  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");

  const [password, setPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");

  const {
    isLocationUpdated,
    latitude,
    longitude,
    city,
    postalCode,
    street,
    number,
  } = LocationConfig();

  useEffect(() => {
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

  const createUser = async () => {
    setLoading(true);
    setFirstNameError("");
    setLastNameError("");
    setEmailError("");
    setPasswordError("");

    if (!firstName) {
      setFirstNameError("Voornaam is verplicht");
    } else if (firstName.length < 3) {
      setFirstNameError("Voornaam moet minstens 2 karakters bevatten");
    }
    if (!lastName) {
      setLastNameError("Achternaam is verplicht");
    } else if (lastName.length < 3) {
      setLastNameError("Achternaam moet minstens 2 karakters bevatten");
    }
    if (!email) {
      setEmailError("Email is verplicht");
    }
    if (!password) {
      setPasswordError("Wachtwoord is verplicht");
    }

    if (!firstName || !lastName || !email || !password) {
      setLoading(false);
      return;
    }

    try {
      const hashedPassword = await hashPassword(password);
      const userCredentail = await createUserWithEmailAndPassword(
        FIREBASE_AUTH,
        email,
        hashedPassword
      );
      const userId = userCredentail.user.uid;

      const userRef = doc(db, "users", userId);
      await setDoc(userRef, {
        //set(ref(db, "users/" + userId), {
        id: userId,
        email: email,
        firstname: firstName,
        lastname: lastName,
        password: hashedPassword,
        role: "user",
        location: {
          city: city,
          postalCode: postalCode,
          street: street,
          number: number,
        },
      });
    } catch (error) {
      setLoading(false);
      if (error.code === "auth/email-already-in-use") {
        setEmailError("Email is al in gebruik");
      }
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.titleContainer}>
        <Text style={stylesFile.title}>Donator</Text>
        <Text style={stylesFile.subTitle}>Registeren</Text>
      </View>
      <View>
        <Text style={stylesFile.text}>Voornaam</Text>
        <TextInput
          style={stylesFile.input}
          value={firstName}
          onChangeText={(text) => setFirstName(text)}
          autoCapitalize="none"
        />
        <View style={styles.errorMessageContainer}>
          <Text style={stylesFile.errorMessage}>{firstNameError}</Text>
        </View>
        <Text style={stylesFile.text}>Achternaam</Text>
        <TextInput
          style={stylesFile.input}
          value={lastName}
          onChangeText={(text) => setLastName(text)}
          autoCapitalize="none"
        />
        <View style={styles.errorMessageContainer}>
          <Text style={stylesFile.errorMessage}>{lastNameError}</Text>
        </View>
        <Text style={stylesFile.text}>Email</Text>
        <TextInput
          style={stylesFile.input}
          value={email}
          onChangeText={(text) => setEmail(text)}
          autoCapitalize="none"
        />
        <Text style={stylesFile.errorMessage}>{emailError}</Text>
        <Text style={stylesFile.text}>Wachtwoord</Text>
        <TextInput
          style={stylesFile.input}
          value={password}
          onChangeText={(text) => setPassword(text)}
          secureTextEntry={true}
        />
      </View>
      <Text style={stylesFile.errorMessage}>{passwordError}</Text>
      {loading ? (
        <ActivityIndicator size="small" color="#FA9248" />
      ) : (
        <>
          <View style={styles.buttonContainer}>
            <CustomButton
              title="Registeren"
              buttonDesign="fullButton"
              onPress={createUser}
            />
            <CustomButton
              title="Annuleren"
              buttonDesign="reverseButton"
              onPress={navigation.goBack}
            />
          </View>
        </>
      )}
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingHorizontal: 20,
    justifyContent: "center",
  },
  titleContainer: {
    alignItems: "center",
  },
  errorMessage: {
    color: "red",
    marginTop: -10,
    marginBottom: 10,
    marginVertical: 0,
    marginHorizontal: 10,
  },
  buttonContainer: {
    alignItems: "center",
  },
  errorMessageContainer: {
    width: Dimensions.get("window").width / 2.3,
  },
});
