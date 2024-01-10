import {
  View,
  Text,
  Dimensions,
  StyleSheet,
  ImageBackground,
  TouchableOpacity,
  TextInput,
  ScrollView,
} from "react-native";
import React, { useState } from "react";
import { Picker } from "@react-native-picker/picker";
import Icon from "react-native-vector-icons/FontAwesome";
import CustomButton from "../../atoms/CustomButton.js";
import * as ImagePicker from "expo-image-picker";
import { setDoc, doc } from "firebase/firestore";
import { db } from "../../components/Firebase.jsx";
import {
  getStorage,
  ref,
  uploadBytes,
  getDownloadURL,
  deleteObject,
} from "firebase/storage";

const EditScreen = ({ navigation, route }) => {
  const [fieldSet, setFieldSet] = useState(route.params.item);

  console.log(fieldSet);

  const handleTextChange = (id, name, text) => {
    setFieldSet((prevFieldSet) => {
      return { ...prevFieldSet, [name]: text };
    });
  };

  const handlePickerChange = (id, value) => {
    setFieldSet((prevFieldSet) => {
      return { ...prevFieldSet, selectedValue: value };
    });
  };

  const openCamera = async () => {
    const permissionResult = await ImagePicker.requestCameraPermissionsAsync();
    if (permissionResult.granted === false) {
      alert("Permission to access camera roll is required!");
      return;
    }
    const result = await ImagePicker.launchCameraAsync();
    handleImage(result);
  };

  const openImagePicker = async () => {
    const permissionResult =
      await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (permissionResult.granted === false) {
      alert("Permission to access library roll is required!");
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync();
    handleImage(result);
  };

  const handleImage = async (result) => {
    if (!result.canceled) {
      const imageUri =
        result.assets && result.assets.length > 0 ? result.assets[0].uri : null;

      const storage = getStorage();
      const response = await fetch(imageUri);
      const blob = await response.blob();
      const oldImageRef = ref(storage, "images/" + fieldSet.image);
      const newImageRef = ref(storage, "images/" + imageUri.split("/").pop());
      await deleteObject(oldImageRef);
      await uploadBytes(newImageRef, blob);
      const url = await getDownloadURL(newImageRef);
      setFieldSet((prevFieldSet) => {
        return {
          ...prevFieldSet,
          image_download_url: url,
          image: imageUri.split("/").pop(),
        };
      });
    }
  };

  const [errorTitle, setErrorTitle] = useState("");
  const [errorContent, setErrorContent] = useState("");
  const [errorCategory, setErrorCategory] = useState("");
  const [errorImage, setErrorImage] = useState("");

  const validation = () => {
    const avalibleCatergies = ["Tafel", "Kast", "Zetel", "Stoel"];
    switch (true) {
      case !fieldSet.title:
        setErrorTitle("Titel is gevraagd");
        break;
      case fieldSet.title.length < 3:
        setErrorTitle("Titel moet minstens 3 karakters bevatten");
        break;
      default:
        setErrorTitle("");
        break;
    }

    switch (true) {
      case !fieldSet.content:
        setErrorContent("Beschrijving is gevraagd");
        break;
      case fieldSet.content.length < 3:
        setErrorContent("Beschrijving moet minstens 10 karakters bevatten");
        break;
      default:
        setErrorContent("");
        break;
    }

    switch (true) {
      case !avalibleCatergies.includes(fieldSet.category):
        setErrorCategory("Categorie is niet geldig");
        break;
      default:
        setErrorCategory("");
        break;
    }

    switch (true) {
      case !fieldSet.image:
        setErrorImage("Foto is gevraagd");
        break;
      default:
        setErrorImage("");
        break;
    }
    return true;
  };

  const handleSave = async () => {
    validation();
    try {
      if (validation() !== true) {
        return;
      } else {
        const { title, content, category, image } = fieldSet;
        const updatedItem = {
          id: fieldSet.id,
          title,
          content,
          category,
          image,
        };
        await setDoc(doc(db, "articles", fieldSet.id), updatedItem);

        navigation.navigate("ListScreen", { updatedItem });
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <ScrollView>
      <View style={styles.container}>
        <View style={styles.errorMessages}>
          {errorTitle ? (
            <Text style={styles.errorMessage}>{errorTitle}</Text>
          ) : null}
          {errorContent ? (
            <Text style={styles.errorMessage}>{errorContent}</Text>
          ) : null}
          {errorCategory ? (
            <Text style={styles.errorMessage}>{errorCategory}</Text>
          ) : null}
          {errorImage ? (
            <Text style={styles.errorMessage}>{errorImage}</Text>
          ) : null}
        </View>

        <Text style={styles.text}>Title</Text>
        <TextInput
          value={fieldSet.title}
          onChangeText={(text) => handleTextChange(fieldSet.id, "title", text)}
          style={styles.input}
        />
        <Text style={styles.text}>Beschrijving</Text>
        <TextInput
          value={fieldSet.content}
          onChangeText={(text) =>
            handleTextChange(fieldSet.id, "content", text)
          }
          style={styles.input}
        />
        <Text style={styles.text}>Categorie</Text>
        <Picker
          style={styles.picker}
          selectedValue={fieldSet.selectedValue}
          onValueChange={(value) => handlePickerChange(fieldSet.id, value)}
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
            source={
              fieldSet.image ? { uri: fieldSet.image_download_url } : null
            }
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

        <View style={styles.saveContainer}>
          <CustomButton
            title="Opslaan"
            buttonDesign="saveButton"
            onPress={handleSave}
          />

          <CustomButton
            title="Annuleren"
            buttonDesign="reverseButton"
            onPress={() => {
              navigation.navigate("ListScreen");
            }}
          />
        </View>
      </View>
    </ScrollView>
  );
};

export default EditScreen;

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
  saveContainer: { marginBottom: 30},
});
