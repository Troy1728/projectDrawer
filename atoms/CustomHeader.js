import { StatusBar } from "expo-status-bar";
import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { IconButton } from "react-native-paper";
import { Ionicons } from "@expo/vector-icons";

const CustomHeader = ({ title, navigation }) => {
  return (
    <View style={styles.headerContainer}>
      <Text style={styles.header}>{title}</Text>
      {title === "Profiel" ? (
        <View style={styles.iconHeader}>
          <Ionicons name="person" size={30} color="#FA9248" />
        </View>
      ) : null}
      <IconButton
        icon="arrow-left-circle"
        backgroundColor="#FA9248"
        onPress={() => navigation.goBack()}
      />
      <StatusBar style="auto" />
    </View>
  );
};

export default CustomHeader;

const styles = StyleSheet.create({
  header: {
    fontWeight: "bold",
    fontSize: 20,
    color: "#FA9248",
    textAlign: "center",
    marginVertical: 10,
  },
  headerContainer: {
    flexDirection: "row-reverse",
    justifyContent: "flex-end",
    alignItems: "center",
    marginHorizontal: 10,
    marginTop: 30,
    marginBottom: 10,
  },
  iconHeader: {
    marginHorizontal: 10,
    borderColor: "#FA9248",
    borderWidth: 3,
    borderRadius: 25,
    padding: 3,
  },
});
