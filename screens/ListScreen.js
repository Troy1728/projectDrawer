import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  Dimensions,
  ActivityIndicator,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import { Picker } from "@react-native-picker/picker";
import { db } from "../components/Firebase";
// import { get, ref } from "firebase/database";
import { collection, getDocs, query, where } from "firebase/firestore";
import CustomButton from "../atoms/CustomButton.js";

const List = ({ navigation }) => {
  const [loading, setLoading] = useState(false);
  const [articles, setData] = useState([]);
  const [selectedType, setSelectedType] = useState(null);

  const fetchData = async () => {
    setLoading(true);
    try {
      const q = query(collection(db, "articles"));
      if (selectedType) {
        const filterQ = query(collection(db, "articles"), where('category', "==", selectedType));
        const snapshot = await getDocs(filterQ);
        setData(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
      } else {
        const snapshot = await getDocs(q);
        setData(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
      }
    } catch (error) {
      console.error(error);
      setLoading(false);
    } finally {
      setLoading(false);
    }
  };
  const handleFilter = (itemValue) => {
    setSelectedType(itemValue);
  };

  const filteredArticles = selectedType
    ? articles.filter((article) => article.category === selectedType)
    : articles;

  useEffect(() => {
    fetchData();
  }, []);

  // update data when user navigates back to list
  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", () => {
      fetchData();
    });
    return unsubscribe;
  }, [navigation]);

  return (
    <View style={styles.container}>
      {loading ? (
        <ActivityIndicator size="small" color="#FA9248" />
      ) : (
        <CustomButton
          title="Donatie Toevoegen"
          buttonDesign="fullButton"
          onPress={() => navigation.navigate("AddScreen")}
        />
      )}
      <View style={styles.filterContainer}>
        <Picker
          selectedValue={selectedType}
          onValueChange={(itemValue) => handleFilter(itemValue)}
          style={styles.picker}
        >
          <Picker.Item style={styles.label} label="All" value={null} />
          <Picker.Item style={styles.label} label="Tafel" value="Tafel" />
          <Picker.Item style={styles.label} label="Kast" value="Kast" />
          <Picker.Item style={styles.label} label="Zetel" value="Zetel" />
          <Picker.Item style={styles.label} label="Stoel" value="Stoel" />
        </Picker>
      </View>

      <FlatList
        style={styles.posts}
        data={filteredArticles}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.postContainer}>
            <Text style={styles.item}>{item.title}</Text>
            <Text style={styles.item}>{item.content}</Text>
            <Text style={styles.item}>Source: {item.source}</Text>
            <Text style={styles.item}>Categorie: {item.category}</Text>
            <CustomButton
              title="Edit"
              buttonDesign="reverseButton"
              onPress={() => navigation.navigate("EditScreen", { item })}
            />
          </View>
        )}
      />
      <StatusBar style="auto" />
    </View>
  );
};

export default List;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingHorizontal: 10,
  },
  articleList: {
    marginTop: 20,
    backgroundColor: "red",
  },
  postContainer: {
    borderWidth: 2,
    borderColor: "#000",
    borderRadius: 10,
    marginVertical: 10,
    backgroundColor: "rgba(250,146,72,0.7)",
  },
  item: {
    padding: 10,
    fontSize: 18,
    height: 44,
  },
});
