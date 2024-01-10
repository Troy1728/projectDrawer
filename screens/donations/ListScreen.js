import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Image,
  FlatList,
  StyleSheet,
  Dimensions,
  ActivityIndicator,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import { Picker } from "@react-native-picker/picker";
import { db, FIREBASE_AUTH } from "../../components/Firebase.jsx";
import { collection, getDocs, query, where } from "firebase/firestore";
import CustomButton from "../../atoms/CustomButton.js";
import { ref, getDownloadURL, getStorage } from "firebase/storage";

import BasicStyle from "../../styles/styles.js";


const List = ({ navigation }) => {
  const [loading, setLoading] = useState(false);
  const [articles, setData] = useState([]);
  const [selectedType, setSelectedType] = useState(null);
  const [role, setRole] = useState(null);
  const getLoggedInUser = async () => {
    const data = await getDocs(
      query(
        collection(db, "users"),
        where("id", "==", FIREBASE_AUTH.currentUser.uid)
      )
    );
    const role = data.docs[0].data().role;
    setRole(role);
    if (role == "admin" || role == "dev") {
      fetchData();
    } else if (role == "user") {
      fetchData(role);
    }
  };

  const fetchData = async (role) => {
    setLoading(true);
    try {
      if (selectedType) {
        if (role == "user") {
          const filter = query(
            collection(db, "articles"),
            where("role", "==", role),
            where("category", "==", selectedType)
          );
          getData(filter);
        } else {
          const filter = query(
            collection(db, "articles"),
            where("category", "==", selectedType)
          );
          getData(filter);
        }
      } else {
        if (role == "user") {
          const filter = query(
            collection(db, "articles"),
            where("user", "==", FIREBASE_AUTH.currentUser.uid)
          );
          getData(filter);
        } else {
          const filter = query(collection(db, "articles"));
          getData(filter);
        }
      }
    } catch (error) {
      console.error(error);
      setLoading(false);
    } finally {
      setLoading(false);
    }
  };

  const getData = async (filter) => {
    const snapshot = await getDocs(filter);
    const articlesData = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    setData(articlesData);
    if (articlesData.length > 0) {
      const storage = getStorage();
      for (let i = 0; i < articlesData.length; i++) {
        const listRef = ref(storage, "images/" + articlesData[i].image);
        const url = await getDownloadURL(listRef);
        articlesData[i].image_download_url = url;
      }
      setData([...articlesData]);
    }
  };

  const handleFilter = (itemValue) => {
    setSelectedType(itemValue);
  };

  const filteredArticles = selectedType
    ? articles.filter((article) => article.category === selectedType)
    : articles;

  useEffect(() => {
    getLoggedInUser();
  }, []);

  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", () => {
      getLoggedInUser();
    });
    return unsubscribe;
  }, [navigation]);

  return (
    <View style={BasicStyle.container}>
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
      {role == "user" ? (
        <Text style={{ fontSize: 20, fontWeight: "bold", marginBottom: 10 }}>
          Mijn Donaties
        </Text>
      ) : (
        <Text style={{ fontSize: 20, fontWeight: "bold", marginBottom: 10 }}>
          Binnen komende donaties
        </Text>
      )}
      <FlatList
        style={styles.posts}
        data={filteredArticles}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.postContainer}>
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                paddingHorizontal: 20,
                paddingVertical: 10,
              }}
            >
              <View style={{ flexDirection: "column" }}>
                <Text style={BasicStyle.subTitle}>{item.title}</Text>
                <Text style={BasicStyle.content}>
                  {item.content.length > 20
                    ? item.content.substring(0, 20) + "..."
                    : item.content}
                </Text>
                <Text style={BasicStyle.content}>Categorie: {item.category}</Text>
              </View>
              <View style={{ flexDirection: "row" }}>
                <Image
                  style={{
                    width: 130,
                    height: 130,
                    paddingVertical: 5,
                    borderRadius: 10,
                  }}
                  source={{ uri: item.image_download_url }}
                />
              </View>
            </View>
            {item.role == "user" ? (
              <CustomButton
                title="Bijwerken"
                buttonDesign="reverseButton"
                onPress={() => navigation.navigate("EditScreen", { item })}
              />
            ) : (
              <CustomButton
                title="Aanvaarden"
                buttonDesign="reverseButton"
                onPress={() =>
                  navigation.navigate("AcceptenceScreen", { item })
                }
              />
            )}
          </View>
        )}
      />
      <StatusBar style="auto" />
    </View>
  );
};

export default List;

const styles = StyleSheet.create({
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
  image: {
    width: "50%",
    height: 200,
    marginBottom: 20,
  },
});
