import { View, Text, TouchableOpacity, ActivityIndicator, KeyboardAvoidingView, StyleSheet, Dimensions } from 'react-native';
import React, {useState, useEffect } from 'react';
import stylesFile from '../styles/styles';
import { StatusBar } from 'expo-status-bar';
import CustomButton from '../atoms/CustomButton';
import { db, FIREBASE_AUTH } from '../components/Firebase';
import { collection, getDocs, query, where } from 'firebase/firestore';

export default function HomeScreen({ navigation }) {
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
  };

  useEffect(() => {
    getLoggedInUser();
  }, []);


  return (
    <View style={[stylesFile.container]}>
      <View style={[styles.titleContainer]}>
        <Text style={[stylesFile.title]}>Donator</Text>
      </View>
      {role === "admin" || role === "dev" ? (
        <View style={{ justifyContent: "space-evenly" }}>
          <CustomButton
            title="magazijn"
            buttonDesign="fullButton"
            onPress={() => navigation.navigate("StockScreen")}
          />
        </View>
      ) : null}
      <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
        <CustomButton
          title="Profiel"
          buttonDesign="halfButton"
          onPress={() => navigation.navigate("ProfileScreen")}
        />
        <CustomButton
          title="Voorwaarden"
          buttonDesign="halfButton"
          onPress={() => navigation.navigate("ConditionScreen")}
        />
      </View>
      <View style={{ justifyContent: "space-evenly" }}>
        <CustomButton
          title="Alle Donaties"
          buttonDesign="fullButton"
          onPress={() => navigation.navigate("ListScreen")}
        />
      </View>
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  titleContainer: {
    alignItems: 'center', 
    justifyContent: 'center',
    height: Dimensions.get('screen').height / 5,
  }
});