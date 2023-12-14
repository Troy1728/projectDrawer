import { View, Text, TextInput } from "react-native";
import React, { useState, useEffect } from "react";
import { FIREBASE_AUTH, FIREBASE_DB } from "../FirebaseConfig";
import { signOut } from "firebase/auth";
import CustomButton from "../atoms/CustomButton";
//import auth from "@react-native-firebase/auth";
//import firestore from "@react-native-firebase/firestore";
const auth_db = FIREBASE_AUTH;

const signOutUser = async () => {
  try {
    await signOut(auth_db);
    console.log("Gebruiker uitgelogd");
  } catch (error) {
    console.log(error.message);
  }
};

const ProfileScreen = ({ navigation }) => {
  /*const [user, setUser] = useState(null);
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    const unsubscribeAuth = auth().onAuthStateChanged((authUser) => {
      setUser(authUser);

      if (authUser) {
        const userEmail = authUser.email;

        const userRef = firestore()
          .collection("users")
          .where("email", "==", userEmail);

        const unsubscibeFirestore = userRef.onSnapshot((querySnapshot) => {
          if (!querySnapshot.empty) {
            const userDoc = querySnapshot.docs[0];
            const userData = userDoc.data();
            setUserData(userData);
            console.log(userData);
          }
        });
        return () => {
          unsubscibeFirestore();
        };
      }
    });
    return () => {
      unsubscribeAuth();
    };
  }, []);
  */

  return (
    <View>
      <CustomButton
        title="Uitloggen"
        buttonDesign="logoutButton"
        onPress={signOutUser}
      />

      <View>
        <Text>Gebruikersprofiel</Text>
       {/* 
       {user && <Text>Ingelogd als: {user.email}</Text>}
        {userData && (
          <View>
            <Text>Gebruikersgegevens:</Text>
            <Text>Naam: {userData.name}</Text>
          </View>
        )}
      */} 
      </View>
    </View>
  );
};

export default ProfileScreen;
