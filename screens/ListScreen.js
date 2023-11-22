import { View, Text, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native'
import React, { useState, useEffect } from 'react'
import { StatusBar } from 'expo-status-bar'
import { FlatList } from 'react-native-gesture-handler'
import { FIREBASE_DB } from '../FirebaseConfig.js'
import { collection, getDocs } from 'firebase/firestore'
import stylesFile from '../styles.js'
import CustomButton from '../atoms/CustomButton.js'

const List = ({navigation}) => {
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(false)

  const getPostsFromFirestore = async () => {
    setLoading(true)
    const postsCol = collection(FIREBASE_DB, 'posts')
    const postsSnapshot = await getDocs(postsCol)
    const postsData = [];
    postsSnapshot.forEach(doc => {
      postsData.push({ ...doc.data(), id: doc.id });
    });
    setPosts(postsData)
    setLoading(false)
  };

  useEffect(() => {
    getPostsFromFirestore();
  }, []);

  return (
    <View style={stylesFile.container}>
      {loading ? (
        <ActivityIndicator size='small' color='#FA9248' />
      ): (
        <CustomButton title='Donatie Toevoegen' buttenDesign='fullButton' onPress={() => navigation.navigate('AddScreen')} />
      )}

      <FlatList
        style={styles.posts}
        data={posts}
        keyExtractor={(item) => item.id}
        renderItem={({item}) => (
          <View style={styles.postContainer}>
            <Text style={stylesFile.item}>{item.title}</Text>
            <Text style={stylesFile.item}>{item.content}</Text>
            <CustomButton title='Edit' buttenDesign='reverseButton' onPress={() => navigation.navigate('EditScreen', {item})} />
          </View>
        )}
      /> 
      <StatusBar style='auto' />
    </View>
  )
}

export default List

const styles = StyleSheet.create({
  postContainer: {
    borderWidth: 2,
    borderColor: '#000',
    borderRadius: 10,
    marginVertical: 10,
    backgroundColor: "rgba(250,146,72,0.7)",
  },
  item : {
    padding: 10,
    fontSize: 18,
    height: 44,
  }
})