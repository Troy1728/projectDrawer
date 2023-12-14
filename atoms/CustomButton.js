import React from "react";
import {
  TouchableOpacity,
  Text,
  View,
  StyleSheet,
  Dimensions,
} from "react-native";

const CustomButton = ({ title, buttonDesign, onPress }) => {
  return (
    <View>
      {buttonDesign == "fullButton" ? (
        <TouchableOpacity style={[styles.button]} onPress={onPress}>
          <Text style={[styles.buttonTitle]}>{title}</Text>
        </TouchableOpacity>
      ) : buttonDesign == "halfButton" ? (
        <TouchableOpacity
          style={[styles.button, styles.halveButton]}
          onPress={onPress}
        >
          <Text style={[styles.buttonTitle]}>{title}</Text>
        </TouchableOpacity>
      ) : buttonDesign == "reverseButton" ? (
        <TouchableOpacity
          style={[styles.button, styles.reverseButton]}
          onPress={onPress}
        >
          <Text style={[styles.buttonTitle]}>{title}</Text>
        </TouchableOpacity>
        ): buttonDesign == "logoutButton" ? (
        <TouchableOpacity
          style={[styles.button, styles.reverseButton]}
          onPress={onPress}
        >
          <Text style={[styles.buttonTitle]}>{title}</Text>
        </TouchableOpacity>
        ) : null}
    </View>
  );
};
export default CustomButton;

const styles = StyleSheet.create({
  button: {
    width: Dimensions.get("screen").width - 20,
    alignItems: "center",
    paddingHorizontal: 10,
    paddingVertical: 10,
    borderColor: "black",
    backgroundColor: "#FA9248",
    borderWidth: 2,
    borderRadius: 5,
    marginVertical: 10,
  },
  halveButton: {
    width: Dimensions.get("screen").width / 2 - 20,
  },
  reverseButton: {
      backgroundColor: "#FFF",
      borderRadius: 10,
      marginLeft:-2,
      marginBottom: -10,
    
  },
  buttonTitle: {
    fontSize: 15,
    fontWeight: "bold",
  },
});
