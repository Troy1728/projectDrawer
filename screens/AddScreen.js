import { View, Text, TextInput, ActivityIndicator, TouchableOpacity, StyleSheet } from 'react-native'
import React, {useState} from 'react'
import { StatusBar } from 'expo-status-bar'
import { addDoc, collection } from 'firebase/firestore'
import { FIREBASE_DB } from '../FirebaseConfig.js'
import stylesFile from '../styles.js'
import AsyncStorage from '@react-native-async-storage/async-storage'
import CustomButton from '../atoms/CustomButton.js'
// https://firebase.google.com/docs/firestore/manage-data/add-data

const Add = ({navigation}) => {
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [titleError, setTitleError] = useState('')
  const [contentError, setContentError] = useState('')
  const [loading, setLoading] = useState(false)

  async function AddPost() {
    setLoading(true)
    if (!title || title.length < 5) {
      setTitleError('Titel moet minstens 5 karakters lang zijn')
    } else setTitleError('');
    if (!content || content.length < 5) {
      setContentError('Beschrijving moet minstens 5 karakters lang zijn')
    } else setContentError('');
   
    if (!titleError && !contentError) {
      try {    
        const docRef = await addDoc(collection(FIREBASE_DB, "posts"), {
          title: title,
          content: content,
        });
        /* await AsyncStorage.setItem(docRef.id, JSON.stringify({
          title: title,
          content: content,
        })) */
        console.log("Document written with ID: ", docRef.id);
        navigation.navigate('ListScreen')
      } catch (error) {
        console.log(error)
      }finally {
        setLoading(false)
      }
    }
  }

  return (
    <View style={stylesFile.container}>
      <TextInput
        placeholder='Title'
        value={title}
        onChangeText={text => setTitle(text)}
        style={styles.input}
      />
      <Text style={styles.errorMessage}>{titleError}</Text>
      <TextInput
        placeholder='Content'
        value={content}
        onChangeText={text => setContent(text)}
        style={styles.input}
      />
      <Text style={styles.errorMessage}>{contentError}</Text>
      {loading ? (
        <ActivityIndicator size='small' color='#FA9248' />
      ): (
        <CustomButton title='Toevoegen' buttenDesign='fullButton' onPress={AddPost} />
      )}
      <StatusBar style="auto" />
    </View>
  )
}

export default Add

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  input: {
    borderWidth: 1,
    borderColor: '#FA9248',
    borderRadius: 5,
    padding: 10,
    margin: 10,
    width: 200
  },

  errorMessage: {
    color: 'red',
    marginTop: -10,
    marginBottom: 10,
    marginVertical: 0,
    marginHorizontal: 10,
  },
})