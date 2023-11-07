import { View, Text, TextInput, KeyboardAvoidingView, SecureStore, TouchableOpacity, StyleSheet, Touchable, ActivityIndicator, Dimensions } from 'react-native'
import React, {useState} from 'react'
import { StatusBar } from 'expo-status-bar';
import { FIREBASE_AUTH, FIREBASE_DB } from '../FirebaseConfig.js';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import stylesFile from '../styles.js'
import { addDoc, collection } from 'firebase/firestore';
import * as Crypto from 'expo-crypto';

const hashPassword = async (password) => {
  const digest = await Crypto.digestStringAsync(
    Crypto.CryptoDigestAlgorithm.SHA256,
    password
  );
  return digest;
}

const Register = ({navigation}) => {
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [firstNameError, setFirstNameError] = useState('')
  const [lastNameError, setLastNameError] = useState('')
  const [emailError, setEmailError] = useState('')
  const [passwordError, setPasswordError] = useState('')
  const [loading, setLoading] = useState(false)
  const auth = FIREBASE_AUTH;

  const errorHandle = (email, password) => {
    if (!email || email.length < 3) {
      setEmailError('Email moet 3 karakters lang zijn')
    }
    else {
      setEmailError('')
    }
    if (!password || password.length < 6) {
      setPasswordError('Wachtwoord moet 3 karakters lang zijn')
    }
    else {
      setPasswordError('')
    }
    if (!firstName || firstName.length < 3) {
      setFirstNameError('Voornaam moet 3 karakters lang zijn')
    }
    else {
      setFirstNameError('')
    }
    if (!lastName || lastName.length < 3) {
      setLastNameError('Achternaam moet 3 karakters lang zijn')
    }
    else {
      setLastNameError('')
    }
  }

  const signUp = async () => {
    setLoading(true)
    errorHandle(email, password);
    if (!emailError && !passwordError && !firstNameError && !lastNameError) {
      try {

        const hashedPassword = await hashPassword(password);

        const docRef = await addDoc(collection(FIREBASE_DB, "users"), {
          firstName: firstName,
          lastName: lastName,
          email: email,
          // password: hashedPassword,
        });
        console.log("Document written with ID: ", docRef.id);
        const response = await createUserWithEmailAndPassword(auth, email, password)
        console.log(response)
      } catch (error) {
        console.log(error)
      }
      finally {
        setLoading(false)
      }
    }
  }

  return (
    <View style={styles.container}>
      <View style={styles.titleContainer}>
        <Text style={stylesFile.title}>Aanmelden</Text>
      </View>
      <View style={styles.column}>
        <View style={styles.row}>
          <View style={styles.column}>
            <Text style={stylesFile.text}>Voornaam</Text>
            <TextInput
              style={[stylesFile.input, styles.inputLeft]}
              value={firstName}
              onChangeText={(text => setFirstName(text))}
              placeholder={'...'}
              autoCapitalize='none'
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
              onChangeText={(text => setLastName(text))}
              placeholder={'...'}
              autoCapitalize='none'
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
          onChangeText={(text => setEmail(text))}
          placeholder={'...'}
          autoCapitalize='none'
          />
        <Text style={stylesFile.errorMessage}>{emailError}</Text>
        <Text style={stylesFile.text}>Wachtwoord</Text>
        <TextInput
          style={stylesFile.input}
          value={password}
          onChangeText={(text => setPassword(text))}
          placeholder={'...'}
          secureTextEntry={true}
          />
      </View>
      <Text style={stylesFile.errorMessage}>{passwordError}</Text>
      {loading ? (
        <ActivityIndicator size='small' color='#FA9248' />
      ): (
        <>
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={[stylesFile.button, {backgroundColor: '#fff'}]}
              onPress={signUp}
            >
              <Text style={stylesFile.buttonTitle}>Registeren</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={stylesFile.button}
              onPress={navigation.goBack}
            >
              <Text style={stylesFile.buttonTitle}>Annuleren</Text>
            </TouchableOpacity>
          </View>
        </>
      )}
      <StatusBar style="auto" />
    </View>
  )
}

export default Register

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingHorizontal: 20,
    justifyContent: 'center',
  },
  titleContainer: {
    alignItems: 'center',
  },
  errorMessage: {
    color: 'red',
    marginTop: -10,
    marginBottom: 10,
    marginVertical: 0,
    marginHorizontal: 10,
  },
  buttonContainer: {
    alignItems: 'center',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  column: {
    flexDirection: 'column',
    justifyContent: 'space-between',
  },
  inputLeft: {
    width: Dimensions.get('window').width / 2.3,
  },
  inputRight: {
    width: Dimensions.get('window').width / 2.3,
  },
  errorMessageContainer: {
    width: Dimensions.get('window').width / 2.3,
  }

});