import {
  View,
  Text,
  TextInput,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import React, { useState } from "react";
import { StatusBar } from "expo-status-bar";
import { FIREBASE_AUTH } from "../../components/Firebase.jsx";
import { signInWithEmailAndPassword } from "firebase/auth";
import stylesFile from "../../styles/styles.js";

import * as Crypto from "expo-crypto";
import CustomButton from "../../atoms/CustomButton.js";

// Function to hash a password using Expo Crypto
const hashPassword = async (password) => {
  const digest = await Crypto.digestStringAsync(
    Crypto.CryptoDigestAlgorithm.SHA256,
    password
  );
  return digest;
};

const Login = ({ navigation }) => {
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");
  const [password, setPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");

  const signIn = async () => {
    setLoading(true);
    setEmailError("");
    setPasswordError("");

    if (!email) {
      setEmailError("Email is verplicht");
    }
    if (!password) {
      setPasswordError("Wachtwoord is verplicht");
    }

    if (!email || !password) {
      setLoading(false);
      return;
    }
    try {
      if (!emailError && !passwordError) {
        const hashedPassword = await hashPassword(password);
        const response = await signInWithEmailAndPassword(
          FIREBASE_AUTH,
          email,
          hashedPassword
        );
        console.log("Sign in");
      }
    } catch (error) {
      setEmailError("Onjuiste gegevens");
      setPasswordError("Onjuiste gegevens");
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.titleContainer}>
        <Text style={stylesFile.title}>Donator</Text>
        <Text style={stylesFile.subTitle}>Aanmelden</Text>
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
      <Text style={stylesFile.errorMessage}>{passwordError}</Text>

      {loading ? (
        <ActivityIndicator size="small" color="#FA9248" />
      ) : (
        <>
          <View style={styles.buttonContainer}>
            <CustomButton
              title="Aanmelden"
              buttonDesign="fullButton"
              onPress={signIn}
            />
            <CustomButton
              title="Registreren"
              buttonDesign="reverseButton"
              onPress={() => navigation.navigate("RegisterScreen")}
            />
          </View>
        </>
      )}
      <StatusBar style="auto" />
    </View>
  );
};

export default Login;

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
  buttonContainer: {
    alignItems: "center",
  },
});
