import { View, Text, TouchableOpacity, ActivityIndicator, KeyboardAvoidingView, StyleSheet, Dimensions } from 'react-native';
import React from 'react';
import stylesFile from '../styles';
import { StatusBar } from 'expo-status-bar';
import CustomButton from '../atoms/CustomButton';
export default function HomeScreen({ navigation }) {
  return (
    <View style={[stylesFile.container]}>
      <View style={[styles.titleContainer]}>
        <Text style={[stylesFile.title]}>Donator</Text>
      </View>
      <View style={{ justifyContent: "space-evenly" }}>
        <CustomButton
          title="Magazijn"
          buttonDesign="fullButton"
          onPress={() => navigation.navigate("MagazijnScreen")}
        />
      </View>
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