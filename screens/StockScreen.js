import React, { useState } from "react";
import { View, Button, StyleSheet } from "react-native";

const StockScreen = () => {
  return (
    <View style={styles.container}>
      <Button title="Add Form" onPress={console.log("press stock")} />
    </View>
  );
};

export default StockScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingHorizontal: 10,
  },
});
