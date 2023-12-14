/*import { View, Text, StyleSheet, ActivityIndicator } from "react-native";
import React, { useState, useEffect } from "react";
import { StatusBar } from "expo-status-bar";
import { FlatList } from "react-native-gesture-handler";
import { FIREBASE_DB } from "../FirebaseConfig.js";
import { collection, getDocs } from "firebase/firestore";
import stylesFile from "../styles.js";
import CustomButton from "../atoms/CustomButton.js";
import AsyncStorage from "@react-native-async-storage/async-storage";
const List = ({ navigation }) => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);

  const getPostsFromFirestore = async () => {
    setLoading(true);
    try {
      const postsCol = collection(FIREBASE_DB, "posts");
      const postsSnapshot = await getDocs(postsCol);
      const postsData = [];
      postsSnapshot.forEach((doc) => {
        postsData.push({ ...doc.data(), id: doc.id, source: "firestore" });
      });
      setPosts((prevPosts) => [...prevPosts, ...postsData]);
    } catch (error) {
      console.error("Error accord " . error);
      setLoading(false);
    } finally {
      setLoading(false);
    }
  };

  const fetchLocalPosts = async () => {
    try {
      // get all keys from local storage
      const localPostsKeys = await AsyncStorage.getAllKeys();
      const localPostsJson = await AsyncStorage.multiGet(localPostsKeys);
      
      const filterLocalPosts = localPostsJson.map((post) => ({
        ...JSON.parse(post[1]),
        source: "local",
      }));
      
      // filter out posts with duplicate ids
      const uniqueLocalPosts = filterLocalPosts.filter(
        (post, index, self) =>
          index === self.findIndex((p) => p.id === post.id) === index
      );
      // set local posts to state
      setPosts((prevPosts) => [...prevPosts, ...uniqueLocalPosts]);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getPostsFromFirestore();
    fetchLocalPosts();
  }, []);

  return (
    <View style={stylesFile.container}>
      {loading ? (
        <ActivityIndicator size="small" color="#FA9248" />
      ) : (
        <CustomButton
          title="Donatie Toevoegen"
          buttonDesign="fullButton"
          onPress={() => navigation.navigate("AddScreen")}
        />
      )}

      <FlatList
        style={styles.posts}
        data={posts}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.postContainer}>
            <Text style={stylesFile.item}>{item.title}</Text>
            <Text style={stylesFile.item}>{item.content}</Text>
            <Text style={stylesFile.item}>Source: {item.source}</Text>
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
});*/

import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, FlatList, ListItem } from "react-native";
import { StatusBar } from "expo-status-bar";
import AsyncStorage from "@react-native-async-storage/async-storage";

const List = ({ navigation }) => {
  const [data, setData] = useState([]);
  const fetchData = async () => {
    // Retrieve data from local storage
    const storedData = await AsyncStorage.getItem("items");
    const parsedData = storedData ? JSON.parse(storedData) : [];

    // Update the state with the retrieved data
    setData(parsedData);
  };

  useEffect(() => {
    // Fetch data when the component mounts
    fetchData();
  }, []);

  return (
    <View>
      <FlatList
        data={data}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <ListItem
            title={item.title}
            onPress={() => console.log("Item pressed:", item)}
          />
        )}
      />
      <Text onPress={() => navigation.navigate("AddScreen")}>Add Item</Text>
      <StatusBar style="auto" />
    </View>
  );
};

export default List;
