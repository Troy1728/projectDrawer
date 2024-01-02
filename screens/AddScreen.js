import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  ActivityIndicator,
  StyleSheet,
  Dimensions,
  Alert,
  TouchableOpacity,
  ScrollView,
  Image,
  ImageBackground,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import Icon from "react-native-vector-icons/FontAwesome"; // You can choose the icon library you prefer
import CustomButton from "../atoms/CustomButton.js";
import { StatusBar } from "expo-status-bar";
import { Picker } from "@react-native-picker/picker";
import { collection, addDoc } from "firebase/firestore";
import { db, FIREBASE_AUTH } from "../components/Firebase.jsx";

const ITEMS_PER_PAGE = 1;

const Add = ({ navigation }) => {
  const [loading, setLoading] = useState(false);
  const [fieldSets, setFieldSets] = useState([
    { id: 1, title: "", content: "", selectedValue: "Tafel", image: "" },
  ]);
  const [fieldSetErrors, setFieldSetErrors] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const [idCounter, setIdCounter] = useState(2);

  const totalPages = Math.ceil(fieldSets.length / ITEMS_PER_PAGE);
  const visibleFieldSets = fieldSets.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const addFieldSet = () => {
    setIdCounter((prevId) => prevId + 1);
    setFieldSets([
      ...fieldSets,
      { id: idCounter, title: "", content: "", selectedValue: "Tafel" },
    ]);
    setCurrentPage((prevPage) => prevPage + 1);
  };

  const removeFieldSet = () => {
    setFieldSets(fieldSets.filter((item) => item.id !== currentPage));
    setCurrentPage((prevPage) => Math.max(1, prevPage - 1));
  };

  const handleTextChange = (id, key, text) => {
    const updatedFieldSets = fieldSets.map((fieldSet) =>
      fieldSet.id === id ? { ...fieldSet, [key]: text } : fieldSet
    );
    setFieldSets(updatedFieldSets);
  };

  const handlePickerChange = (id, value) => {
    const updatedFieldSets = fieldSets.map((item) => {
      if (item.id === id) {
        return { ...item, selectedValue: value };
      }
      return item;
    });
    setFieldSets(updatedFieldSets);
  };

   console.log(fieldSets);

  const openCamera = async () => {
    const permissionResult = await ImagePicker.requestCameraPermissionsAsync();
    if (permissionResult.granted === false) {
      alert("Permission to access camera roll is required!");
      return;
    }
    const result = await ImagePicker.launchCameraAsync();
    if (!result.canceled) {
      const imageUri =
        result.assets && result.assets.length > 0 ? result.assets[0].uri : null;
      //setInputImage(imageUri);
      setFieldSets((prevFieldSets) =>
        prevFieldSets.map((item) =>
          item.id === currentPage ? { ...item, image: imageUri } : item
        )
      );
    }
  };

  const openImagePicker = async () => {
    const permissionResult =
      await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (permissionResult.granted === false) {
      alert("Permission to access library roll is required!");
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync();
    if (!result.canceled) {
      const imageUri =
        result.assets && result.assets.length > 0 ? result.assets[0].uri : null;
      //setInputImage(imageUri);
      setFieldSets((prevFieldSets) =>
        prevFieldSets.map((item) =>
          item.id === currentPage ? { ...item, image: imageUri } : item
        )
      );
    }
  };

  const addItem = async () => {
    setLoading(true);
    let newFieldSetErrors = {};
    fieldSets.forEach((item) => {
      let fieldSetError = { page: item.id };
      if (!item.title.trim()) {
        fieldSetError = { ...fieldSetError, title: "Vul een titel in" };
      }
      if (!item.content.trim()) {
        fieldSetError = {
          ...fieldSetError,
          content: "Vul een beschrijving in",
        };
      }
      if (Object.keys(fieldSetError).length > 0) {
        newFieldSetErrors = {
          ...newFieldSetErrors,
          [item.id]: { ...newFieldSetErrors[item.id], ...fieldSetError },
        };
      }
    });

    newFieldSetErrors = Object.fromEntries(
      Object.entries(newFieldSetErrors).filter(
        ([key, value]) => value.title || value.content
      )
    );

    setFieldSetErrors(newFieldSetErrors);

    if (Object.keys(newFieldSetErrors).length > 0) {
      const errorMessage = Object.values(newFieldSetErrors)
        .map(
          (fieldSetError) =>
            `Pagina ${fieldSetError.page}: \n ${Object.values(fieldSetError)
              .filter((value) => typeof value === "string" && value !== "")
              .join("\n")}`
        )
        .join("\n");
      Alert.alert("Waarschuwing", errorMessage, [{ text: "OK" }]);
      setLoading(false);
      return;
    } else {
      try {
        const user = FIREBASE_AUTH.currentUser.uid;
        const setOperations = fieldSets.map(async (item) => {
          await addDoc(collection(db, "articles/"), {
            title: item.title,
            content: item.content,
            category: item.selectedValue,
            image: item.image,
            status: "in behandeling",
            user: user,
          });
        });
    
        await Promise.all(setOperations);
        console.log("All done");
        navigation.navigate("ListScreen");
      } catch (error) {
        console.error(error);
        setLoading(false);
      } finally {
        setLoading(false);
      }
    }
    setFieldSetErrors({});
  };

  const renderFieldSets = () => {
    return visibleFieldSets.map((item) => (
      <View key={item.id}>
        <View style={styles.errorMessages}>
          {fieldSetErrors[item.id] && (
            <Text style={styles.errorMessage}>
              {fieldSetErrors[item.id].title}
            </Text>
          )}
          {fieldSetErrors[item.id] && (
            <Text style={styles.errorMessage}>
              {fieldSetErrors[item.id].content}
            </Text>
          )}
        </View>
        <Text style={styles.text}>Title</Text>
        <TextInput
          value={item.title}
          onChangeText={(text) => handleTextChange(item.id, "title", text)}
          style={styles.input}
        />
        <Text style={styles.text}>Beschrijving</Text>
        <TextInput
          value={item.content}
          onChangeText={(text) => handleTextChange(item.id, "content", text)}
          style={styles.input}
        />
        <Text style={styles.text}>Categorie</Text>
        <Picker
          style={styles.picker}
          selectedValue={item.selectedValue}
          onValueChange={(value) => handlePickerChange(item.id, value)}
        >
          <Picker.Item
            style={styles.label}
            key="Tafel"
            label="Tafel"
            value="Tafel"
          />
          <Picker.Item
            style={styles.label}
            key="Kast"
            label="Kast"
            value="Kast"
          />
          <Picker.Item
            style={styles.label}
            key="Zetel"
            label="Zetel"
            value="Zetel"
          />
          <Picker.Item
            style={styles.label}
            key="Stoel"
            label="Stoel"
            value="Stoel"
          />
        </Picker>
        <View style={styles.imageContainer}>
          <Text style={styles.text}>Foto</Text>
          <ImageBackground
            source={item.image ? { uri: item.image } : null}
            style={styles.configImage}
          >
            <TouchableOpacity onPress={openCamera}>
              <Icon name="camera" style={styles.icon} />
            </TouchableOpacity>

            <TouchableOpacity onPress={openImagePicker}>
              <Icon name="image" style={styles.icon} />
            </TouchableOpacity>
          </ImageBackground>
        </View>
      </View>
    ));
  };

  return (
    <ScrollView>
    <View style={styles.container}>
      {renderFieldSets()}

      <CustomButton
        title="+ Arikel Toevoegen +"
        buttonDesign="artikelButton"
        onPress={addFieldSet}
      />
      <CustomButton
        title="- Artikel Verwijderen -"
        buttonDesign="artikelButton"
        onPress={removeFieldSet}
      />

      {loading ? (
        <ActivityIndicator size="small" color="#FA9248" />
      ) : (
        <View style={{ marginBottom: 20 }}>
          <CustomButton
            title="Toevoegen"
            buttonDesign="fullButton"
            onPress={addItem}
          />
          <CustomButton
            title="Annuleren"
            buttonDesign="reverseButton"
            onPress={() => {
              navigation.navigate("ListScreen");
            }}
          />
        </View>
      )}

      <View style={styles.paginationContainer}>
        <CustomButton
          title="<"
          buttonDesign="paginateButton"
          onPress={() =>
            setCurrentPage((prevPage) => Math.max(1, prevPage - 1))
          }
        />
        <Text
          style={styles.paginationLabel}
        >{`${currentPage} of ${totalPages}`}</Text>
        <CustomButton
          title=">"
          buttonDesign="paginateButton"
          onPress={() =>
            setCurrentPage((prevPage) => Math.min(totalPages, prevPage + 1))
          }
        />
      </View>
      <StatusBar style="auto" />
    </View>
    </ScrollView>
  );
};
export default Add;

const { width, height } = Dimensions.get("screen");
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingHorizontal: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: "#FA9248",
    borderRadius: 5,
    padding: 10,
    margin: 10,
    width: width * 0.9,
  },
  picker: {
    width: width * 0.4,
    marginBottom: 10,
  },
  label: {
    fontSize: 16,
    marginBottom: 10,
    color: "black",
  },
  errorMessage: {
    color: "red",
    marginTop: -10,
    marginBottom: 10,
    marginVertical: 0,
    marginHorizontal: 10,
  },
  text: {
    fontSize: 18,
    fontWeight: "bold",
    marginVertical: 5,
  },
  paginationContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    marginBottom: 20,
  },
  paginationLabel: {
    fontSize: 14,
    fontWeight: "bold",
    marginTop: 20,
  },
  dropdownContainer: {
    height: 40,
    width: 200,
    margin: 10,
  },
  dropdownStyle: {
    backgroundColor: "#fafafa",
  },
  dropdownItemStyle: {
    justifyContent: "flex-start",
  },
  dropdownLabelStyle: {
    fontSize: 16,
    textAlign: "left",
    color: "#000",
  },
  errorMessages: {
    width: 200,
    margin: 10,
  },
  imageContainer: {
    flexDirection: "column",
    justifyContent: "space-around",
  },
  configImage: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    width: width * 0.9,
    height: height * 0.15,
    marginLeft: 10,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: "#FA9248",
  },
  icon: {
    backgroundColor: "#fff",
    fontSize: 20,
    padding: 10,
    borderRadius: 50,
  },
});
