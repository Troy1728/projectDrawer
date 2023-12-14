import {
  View,
  Text,
  TextInput,
  KeyboardAvoidingView,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import React, { useState } from "react";
import { StatusBar } from "expo-status-bar";
import { FIREBASE_AUTH } from "../../FirebaseConfig.js";

import { signInWithEmailAndPassword } from "firebase/auth";
import stylesFile from "../../styles.js";

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
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [loading, setLoading] = useState(false);
  const auth = FIREBASE_AUTH;

  const errorHandle = (email, password, error) => {
    if (!email || email.length < 3) {
      setEmailError("Email moet 3 karakters lang zijn");
    } else {
      setEmailError("");
    }
    if (!password || password.length < 6) {
      setPasswordError("Wachtwoord moet 3 karakters lang zijn!");
    } else {
      setPasswordError("");
    }
    if (error) {
      setEmailError("Onjuiste gegevens");
      setPasswordError("Onjuiste gegevens");
    } else {
      setEmailError("");
      setPasswordError("");
    }
  };

  const signIn = async () => {
    setLoading(true);
    errorHandle(email, password);
    try {
      if (!emailError && !passwordError) {
        const response = await signInWithEmailAndPassword(
          auth,
          email,
          password
        );
        console.log(response);
      }
    } catch (error) {
      errorHandle(email, password, true);
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.titleContainer}>
        <Text style={stylesFile.title}>Aanmelden</Text>
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
