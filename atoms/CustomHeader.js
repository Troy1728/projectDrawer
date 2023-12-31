import { StatusBar } from "expo-status-bar";
import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { IconButton } from "react-native-paper";

const CustomHeader = ({ title, navigation }) => {
  return (
    <View style={styles.headerContainer}>
      <View
        style={{ flexDirection: "row-reverse", flex: 1, justifyContent: "space-between", alignItems: "center", marginHorizontal: 10}}
      >
        <Text style={styles.header}>{title}</Text>
        <Text style={styles.header}>TERUG</Text>
      </View>
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
    fontSize: 16,
    color: "#FA9248",
    textAlign: "center",
    marginVertical: 20,
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