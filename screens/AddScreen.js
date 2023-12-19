import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  ActivityIndicator,
  StyleSheet,
  ScrollView,
} from "react-native";
import CustomButton from "../atoms/CustomButton.js";
import DropDownPicker from "react-native-dropdown-picker";
import { StatusBar } from "expo-status-bar";

const ITEMS_PER_PAGE = 2;

const Add = ({ navigation }) => {
  const [loading, setLoading] = useState(false);
  const [fieldSets, setFieldSets] = useState([
    { id: 1, title: "", content: "", dropdownValue: null },
  ]);
  const [currentPage, setCurrentPage] = useState(1);
  const items=[
    { label: "appel", value: "appel" },
    { label: "peer", value: "peer" },
  ];

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

  const handleFieldChange = (setId, key, value) => {
    setFieldSets((prevFieldSets) => {
      const updatedFieldSets = prevFieldSets.map((fieldSet) =>
        fieldSet.id === setId ? { ...fieldSet, [key]: value } : fieldSet
      );
      console.log(updatedFieldSets);
      return updatedFieldSets;
    });
  };

  const addFieldSet = () => {
    setFieldSets((prevFieldSets) => [
      ...prevFieldSets,
      {
        id: prevFieldSets.length + 1,
        title: "",
        content: "",
        dropdownValue: null,
      },
    ]);
    setCurrentPage((prevPage) => prevPage + 1);
  };

  const addItem = async () => {
    setLoading(true);
    validateInputs();
    setLoading(false);
  };

  const renderFieldSets = () => {
    return visibleFieldSets.map((fieldSet) => (
      <View key={fieldSet.id}>
        <Text style={styles.text}>Title</Text>
        <TextInput
          placeholder="Titel"
          value={fieldSet.title}
          onChangeText={(text) => handleFieldChange(fieldSet.id, "title", text)}
          style={styles.input}
        />

        <Text style={styles.text}>Content</Text>
        <TextInput
          placeholder="Beschrijving"
          value={fieldSet.content}
          onChangeText={(text) =>
            handleFieldChange(fieldSet.id, "content", text)
          }
          style={styles.input}
        />

        <DropDownPicker
          items={items}
          open={fieldSet.open}
          setOpen={(open) => handleFieldChange(fieldSet.id, "open", open)}

          />
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

      {loading ? (
        <ActivityIndicator size="small" color="#FA9248" />
      ) : (
        <View>
          <CustomButton
            title="Toevoegen"
            buttonDesign="fullButton"
            onPress={addItem}
          />
          <CustomButton
            title="Annuleren"
            buttonDesign="fullButton"
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
