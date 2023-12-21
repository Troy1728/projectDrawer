import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  ActivityIndicator,
  StyleSheet,
} from "react-native";
import CustomButton from "../atoms/CustomButton.js";
import { StatusBar } from "expo-status-bar";
import { Picker } from "@react-native-picker/picker";

const ITEMS_PER_PAGE = 1;

const Add = ({ navigation }) => {
  const [loading, setLoading] = useState(false);
  const [fieldSets, setFieldSets] = useState([
    { id: 1, title: "", content: "", selectedValue: "Option 1" },
  ]);
  const [currentPage, setCurrentPage] = useState(1);
  const [idCounter, setIdCounter] = useState(2);

  const totalPages = Math.ceil(fieldSets.length / ITEMS_PER_PAGE);
  const visibleFieldSets = fieldSets.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const validateInputs = () => {
    fieldSets.forEach((fieldSet) => {
      if (!fieldSet.title || fieldSet.title.length < 3) {
        setTitleError("Titel moet minstens 3 karakters lang zijn");
      } else setTitleError("");
      if (!fieldSet.content || fieldSet.content.length < 5) {
        setContentError("Beschrijving moet minstens 5 karakters lang zijn");
      } else setContentError("");
    });
  };

  const addFieldSet = () => {
    setIdCounter((prevId) => prevId + 1);
    setFieldSets([
      ...fieldSets,
      { id: idCounter, title: "", content: "", selectedValue: "Option 1" },
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

  console.log("_________________");
  console.log(fieldSets);

  const addItem = async () => {
    setLoading(true);
    validateInputs();
    setLoading(false);
  };

  const renderFieldSets = () => {
    return visibleFieldSets.map((item) => (
      <View key={item.id}>
        <Text style={styles.text}>Title</Text>
        <TextInput
          placeholder="Titel"
          value={item.title}
          onChangeText={(text) => handleTextChange(item.id, "title", text)}
          style={styles.input}
        />

        <Text style={styles.text}>Beschrijving</Text>
        <TextInput
          placeholder="Beschrijving"
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
            key="Option1"
            label="Option 1"
            value="Option 1"
          />
          <Picker.Item
            style={styles.label}
            key="Option2"
            label="Option 2"
            value="Option 2"
          />
          <Picker.Item
            style={styles.label}
            key="Option3"
            label="Option 3"
            value="Option 3"
          />
        </Picker>
      </View>
    ));
  };

  return (
    <View style={styles.container}>
      {renderFieldSets()}

      <CustomButton
        title="+ Meer toevoegen +"
        buttonDesign="fullButton"
        onPress={addFieldSet}
      />
      <CustomButton
        title="- Artikel annuleren -"
        buttonDesign="fullButton"
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

      <View style={styles.pagination}>
        <CustomButton
          title="<"
          buttonDesign="paginateButton"
          onPress={() =>
            setCurrentPage((prevPage) => Math.max(1, prevPage - 1))
          }
        />
        <Text>{`Page ${currentPage} of ${totalPages}`}</Text>
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
  );
};
export default Add;

const styles = StyleSheet.create({
  picker: {
    height: 50,
    width: 150,
    backgroundColor: "white",
    borderColor: "black",
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 10,
  },
  label: {
    fontSize: 16,
    marginBottom: 10,
    color: "black",
  },
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
    width: 200,
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
  pagination: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    marginBottom: 20,
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
});
