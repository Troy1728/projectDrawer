import {
  View,
  Text,
  Dimensions,
  StyleSheet,
  ImageBackground,
  Switch,
} from "react-native";
import React, { useEffect, useState } from "react";
import CustomButton from "../atoms/CustomButton";
import {
  getDocs,
  query,
  collection,
  where,
  updateDoc,
  doc,
} from "firebase/firestore";
import { db } from "../components/Firebase.jsx";

const AcceptenceScreen = ({ navigation, route }) => {
  const [fieldSet, setFieldSet] = useState(route.params.item);
  const [userData, setUserData] = useState();

  const [isEnabled, setIsEnabled] = useState(false);
  const toggleSwitch = () => {
    setIsEnabled((previousState) => !previousState);
  };

  const getArticleUser = async () => {
    if (fieldSet.user) {
      const data = await getDocs(
        query(collection(db, "users"), where("id", "==", fieldSet.user))
      );

      if (data.docs.length > 0) {
        setUserData(data.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
      } else {
        console.error("No such document!");
      }
    } else {
      console.error("No such document!");
    }
  };

  useEffect(() => {
    getArticleUser();
  }, []);

  const handleSave = async () => {
    try {
      await updateDoc(doc(db, "articles", fieldSet.id), {
        status: isEnabled ? "goed gekeurd" : "afgekeurd",
      });
      console.log("Document successfully updated!");
      navigation.navigate("StockScreen");
    } catch (error) {
      console.error("Error updating document: ", error);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.valueContainer}>
        <View style={styles.articlesContainer}>
          <Text style={styles.text}>Title</Text>
          <Text style={styles.value}>{fieldSet.title}</Text>

          <Text style={styles.text}>Beschrijving</Text>
          <Text style={styles.value}>{fieldSet.content}</Text>

          <Text style={styles.text}>Categorie</Text>
          <Text style={styles.value}>{fieldSet.category}</Text>
        </View>
        {userData ? (
          <View style={styles.userContainer}>
            <Text style={styles.text}>Gebruiker</Text>
            <Text style={styles.value}>{userData[0].firstname}</Text>
            <Text style={styles.value}>{userData[0].lastname}</Text>
            <Text style={styles.text}>Adres</Text>
            <Text style={styles.value}>{userData[0].location.city}</Text>
            <Text style={styles.value}>{userData[0].location.postalCode}</Text>
            <Text style={styles.value}>{userData[0].location.street}</Text>
            <Text style={styles.value}>{userData[0].location.number}</Text>
          </View>
        ) : null}
      </View>

      <View style={styles.imageContainer}>
        <Text style={styles.text}>Foto</Text>
        <ImageBackground
          source={fieldSet.image ? { uri: fieldSet.image_download_url } : null}
          style={styles.configImage}
        ></ImageBackground>
      </View>
      <View style={styles.decisionContainer}>
        <Text style={styles.title}>Artikel aanvaarden:</Text>
        <View style={{ flexDirection: "row", justifyContent: "space-around" }}>
          <Text style={styles.text}>Weigeren</Text>
          <Switch
            key={isEnabled ? "on" : "off"}
            trackColor={{ false: "#ea918a", true: "#bbe166" }}
            thumbColor={isEnabled ? "#8FCE00" : "#b22d20"}
            ios_backgroundColor="#3e3e3e"
            onValueChange={toggleSwitch}
            value={isEnabled}
          />
          <Text style={styles.text}>Aanvaarden</Text>
        </View>
      </View>
      <View style={styles.saveContainer}>
        <CustomButton
          title="Opslaan"
          buttonDesign="primaryButton"
          onPress={() => {
            handleSave();
          }}
        />
        <CustomButton
          title="Annuleren"
          buttonDesign="reverseButton"
          onPress={() => {
            navigation.navigate("StockScreen");
          }}
        />
      </View>
    </View>
  );
};

export default AcceptenceScreen;

const { width, height } = Dimensions.get("screen");
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingHorizontal: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: "#FA9248",
    borderRadius: 5,
    padding: 10,
    margin: 10,
    width: width * 0.9,
  },
  picker: {
    width: width * 0.4,
    marginBottom: 10,
  },
  label: {
    fontSize: 16,
    marginBottom: 10,
    color: "black",
  },
  errorMessage: {
    color: "red",
    marginTop: -10,
    marginBottom: 10,
    marginVertical: 0,
    marginHorizontal: 10,
  },
  text: {
    fontSize: 18,
    fontWeight: "bold",
    marginVertical: 5,
  },
  paginationContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    marginBottom: 20,
  },
  paginationLabel: {
    fontSize: 14,
    fontWeight: "bold",
    marginTop: 20,
  },
  dropdownContainer: {
    height: 40,
    width: 200,
    margin: 10,
  },
  dropdownStyle: {
    backgroundColor: "#fafafa",
  },
  dropdownItemStyle: {
    justifyContent: "flex-start",
  },
  dropdownLabelStyle: {
    fontSize: 16,
    textAlign: "left",
    color: "#000",
  },
  errorMessages: {
    width: 200,
    margin: 10,
  },
  imageContainer: {
    flexDirection: "column",
    justifyContent: "space-around",
  },
  configImage: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    width: width * 0.9,
    height: height * 0.25,
    marginLeft: 10,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: "#FA9248",
  },
  icon: {
    backgroundColor: "#fff",
    fontSize: 20,
    padding: 10,
    borderRadius: 50,
  },
  saveContainer: {},
  valueContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  articlesContainer: {
    width: width * 0.5,
  },
  userContainer: {
    width: width * 0.4,
  },
  value: {
    fontSize: 16,
    marginBottom: 10,
    color: "black",
  },
  title: {
    marginTop: 20,
    fontSize: 18,
    fontWeight: "bold",
    marginVertical: 5,
  },
});
