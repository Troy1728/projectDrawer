// https://www.youtube.com/watch?v=q1bxyyKh3Dc

import { StatusBar } from "expo-status-bar";
import React, { useState } from "react";
import {
  Text,
  View,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  ActivityIndicator,
  KeyboardAvoidingView,
} from "react-native";
import { ref, set } from "firebase/database";
import { db } from "../../components/Firebase.jsx";
import { createUserWithEmailAndPassword } from "firebase/auth";
import CustomButton from "../../atoms/CustomButton";
import stylesFile from "../../styles.js";
import * as Crypto from "expo-crypto";
import { auth } from "../../components/Firebase.jsx";
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

  const validateInput = (fieldName, value) => {
    if (fieldName === "firstName") {
      if (value === "") {
        setFirstNameError("Voornaam is verplicht.");
      } else {
        setFirstNameError("");
      }
    } else if (fieldName === "lastName") {
      if (value === "") {
        setLastNameError("Achternaam is verplicht.");
      } else {
        setLastNameError("");
      }
    } else if (fieldName === "email") {
      if (value === "") {
        setEmailError("Email is verplicht.");
      } else {
        setEmailError("");
      }
    } else if (fieldName === "password") {
      if (value === "") {
        setPasswordError("Wachtwoord is verplicht.");
      } else {
        setPasswordError("");
      }
    }
  };

  const createUser = () => {
    setLoading(true);

    const validatedFirstName = validateInput("firstName", firstName);
    const validatedLastName = validateInput("lastName", lastName);
    const validatedEmail = validateInput("email", email);
    const validatedPassword = validateInput("password", password);

    /*if (
      validatedFirstName &&
      validatedLastName &&
      validatedEmail &&
      validatedPassword
    ) {
      */
      try {
        const hashedPassword = hashPassword(password);
        const userId = Date.now().toString();

        set(ref(db, "users/" + userId), {
          id: userId,
          email: email,
          firstname: firstName,
          lastname: lastName,
          password: hashedPassword,
          location: {
            city: "",
            postalCode: "",
            street: "",
            number: "",
          },
        });
        const user = createUserWithEmailAndPassword(auth, email, password);
        console.log("User added to database.");
      } catch (error) {
        setLoading(false);
        console.error(error);
      } finally {
        setLoading(false);
      }
    /*} else {
      setLoading(false);
    }*/
  };

  return (
    <View style={styles.container}>
      <View style={styles.titleContainer}>
        <Text style={stylesFile.title}>Registeren</Text>
      </View>
      <View style={styles.column}>
        <View style={styles.row}>
          <View style={styles.column}>
            <Text style={stylesFile.text}>Voornaam</Text>
            <TextInput
              style={[stylesFile.input, styles.inputLeft]}
              value={firstName}
              onChangeText={(text) => setFirstName(text)}
              placeholder={"..."}
              autoCapitalize="none"
            />
            <View style={styles.errorMessageContainer}>
              <Text style={stylesFile.errorMessage}>{firstNameError}</Text>
            </View>
          </View>
          <View style={styles.column}>
            <Text style={stylesFile.text}>Achternaam</Text>
            <TextInput
              style={[stylesFile.input, styles.inputRight]}
              value={lastName}
              onChangeText={(text) => setLastName(text)}
              placeholder={"..."}
              autoCapitalize="none"
            />
            <View style={styles.errorMessageContainer}>
              <Text style={stylesFile.errorMessage}>{lastNameError}</Text>
            </View>
          </View>
        </View>
        <Text style={stylesFile.text}>Email</Text>
        <TextInput
          style={stylesFile.input}
          value={email}
          onChangeText={(text) => setEmail(text)}
          placeholder={"..."}
          autoCapitalize="none"
        />
        <Text style={stylesFile.errorMessage}>{emailError}</Text>
        <Text style={stylesFile.text}>Wachtwoord</Text>
        <TextInput
          style={stylesFile.input}
          value={password}
          onChangeText={(text) => setPassword(text)}
          placeholder={"..."}
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
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  column: {
    flexDirection: "column",
    justifyContent: "space-between",
  },
  inputLeft: {
    width: Dimensions.get("window").width / 2.3,
  },
  inputRight: {
    width: Dimensions.get("window").width / 2.3,
  },
  errorMessageContainer: {
    width: Dimensions.get("window").width / 2.3,
  },
});
