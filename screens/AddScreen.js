import {
  View,
  Text,
  TextInput,
  ActivityIndicator,
  StyleSheet,
} from "react-native";
import React, { useEffect, useState } from "react";
import { StatusBar } from "expo-status-bar";
import { addDoc, collection } from "firebase/firestore";
import { FIREBASE_DB } from "../FirebaseConfig.js";
import stylesFile from "../styles.js";
import AsyncStorage from "@react-native-async-storage/async-storage";
import CustomButton from "../atoms/CustomButton.js";
// https://firebase.google.com/docs/firestore/manage-data/add-data

const Add = ({ navigation }) => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [titleError, setTitleError] = useState("");
  const [contentError, setContentError] = useState("");
  const [loading, setLoading] = useState(false);

  const validateInputs = () => {
    if (!title || title.length < 5) {
      setTitleError("Titel moet minstens 5 karakters lang zijn");
    } else setTitleError("");
    if (!content || content.length < 5) {
      setContentError("Beschrijving moet minstens 5 karakters lang zijn");
    } else setContentError("");
  };

  const [item, setItem] = useState("");

  const addItem = async () => {
    // Retrieve existing data from local storage
    const existingData = await AsyncStorage.getItem("items");
    const parsedData = existingData ? JSON.parse(existingData) : [];

    // Add the new item
    const updatedData = [...parsedData, { id: Date.now(), title: item }];

    // Store the updated data back to local storage
    await AsyncStorage.setItem("items", JSON.stringify(updatedData));

    // Navigate back to the ListPage
    navigation.goBack();
  };

  /*
    setLoading(true);
    validateInputs();

    if (!titleError && !contentError) {
      try {
         if (isConnected) {
          console.log("Connected with wifi");
          setLoading(true);
          const docRef = await addDoc(collection(FIREBASE_DB, "posts"), {
            title: title,
            content: content,
          });
          console.log("Document written with ID: ", docRef.id);
          navigation.navigate("ListScreen");
        }  
        // const localPostKeys = await AsyncStorage.getAllKeys();
        // const newKey = `localPost_${localPostKeys.length + 1}`;
      
        const newPost = {
          title,
          content,
          id: "localPost_temp",
          source: "local",
        };
        await AsyncStorage.setItem(newKey, JSON.stringify(newPost));
        console.log(`Post saved locally: ${newKey}`);
        navigation.navigate("ListScreen");
         

      } catch (error) {
        console.log("Error:", error);
      } finally {
        setLoading(false);
      }
    } else {
      setLoading(false);
    }
  }
  */

  return (
    <View style={stylesFile.container}>
      <TextInput
        placeholder="Title"
        value={title}
        onChangeText={(text) => setTitle(text)}
        style={styles.input}
      />
      <Text style={styles.errorMessage}>{titleError}</Text>
      <TextInput
        placeholder="Content"
        value={content}
        onChangeText={(text) => setContent(text)}
        style={styles.input}
      />
      <Text style={styles.errorMessage}>{contentError}</Text>
      {loading ? (
        <ActivityIndicator size="small" color="#FA9248" />
      ) : (
        <CustomButton
          title="Toevoegen"
          buttonDesign="fullButton"
          onPress={addItem}
        />
      )}

      <StatusBar style="auto" />
    </View>
  );
};

export default Add;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  input: {
    borderWidth: 1,
    borderColor: "#FA9248",
    borderRadius: 5,
    padding: 10,
    margin: 10,
    width: 200,
  },

  errorMessage: {
    color: "red",
    marginTop: -10,
    marginBottom: 10,
    marginVertical: 0,
    marginHorizontal: 10,
  },
});
