import { StyleSheet, Dimensions } from "react-native";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 10,
  },
  text: {
    fontSize: 20,
    fontWeight: "bold",
  },
  headerTitle: {
    fontFamily: "Roboto",
    fontSize: 36,
    fontWeight: "bold",
    color: "#FA9248",
    textShadowColor: "black",
    textShadowOffset: { width: -1, height: 2 },
    textShadowRadius: 2,
  },
  subTitle: {
    fontFamily: "Roboto",
    fontSize: 24,
    fontWeight: "bold",
  },
  content: {
    paddingVertical: 5,
    fontSize: 16,
  },
  buttonTitle: {
    fontSize: 15,
    fontWeight: "bold",
  },
  button: {
    width: Dimensions.get("window").width / 2,
    alignItems: "center",
    paddingHorizontal: 10,
    paddingVertical: 10,
    borderColor: "black",
    backgroundColor: "#FA9248",
    borderWidth: 2,
    borderRadius: 5,
    marginVertical: 10,
  },
  input: {
    height: 40,
    margin: 12,
    marginHorizontal: 0,
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
  },
  errorMessage: {
    color: "red",
    marginTop: -10,
    marginBottom: 10,
    marginVertical: 0,
    marginHorizontal: 5,
  },
});

export default styles;
