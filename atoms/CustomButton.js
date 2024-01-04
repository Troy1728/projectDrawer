import React from "react";
import {
  TouchableOpacity,
  Text,
  View,
  StyleSheet,
  Dimensions,
} from "react-native";

const CustomButton = ({ title, buttonDesign, onPress }) => {
  const buttonStyles = {
    fullButton: {},
    halfButton: styles.halveButton,
    reverseButton: styles.reverseButton,
    logoutButton: styles.reverseButton,
    paginateButton: styles.paginateButton,
    artikelButton: styles.artikelButton,
  };
  
  const style = [styles.button, buttonStyles[buttonDesign]];

  return buttonDesign ? (
    <TouchableOpacity style={style} onPress={onPress}>
      <Text style={[styles.buttonTitle]}>{title.toUpperCase()}</Text>
    </TouchableOpacity>
  ): null;  
};
export default CustomButton;

const styles = StyleSheet.create({
  button: {
    width: Dimensions.get("window").width - 20 ,
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
    marginLeft: -2,
    marginBottom: -10,
  },
  paginateButton: {
    backgroundColor: "#FFF",
    borderRadius: 10,
    marginLeft: 10,
    marginBottom: -10,
    width: 50,
  },
  artikelButton: {
    backgroundColor: "rgba(250,146,72,0.5)",
    borderStyle: "dashed",
  },
  buttonTitle: {
    fontSize: 15,
    fontWeight: "900",
  },
});
