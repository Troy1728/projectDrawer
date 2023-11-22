import { View, Text, TouchableOpacity, ActivityIndicator, KeyboardAvoidingView, StyleSheet, Dimensions } from 'react-native';
import React from 'react';
import stylesFile from '../styles';
import { StatusBar } from 'expo-status-bar';
 
export default function HomeScreen({ navigation }) {
  return (
    <View style={[stylesFile.container]}>
      <View style={[styles.titleContainer]}>
        <Text style={[stylesFile.title]}>Donator</Text>
      </View>
      <View style={{justifyContent: 'space-evenly'}}>
        <TouchableOpacity style={[styles.button]} onPress={() => navigation.navigate('MagazijnScreen')}>
          <Text style={[stylesFile.buttonTitle]}>Magazijn</Text>
        </TouchableOpacity>
      </View>
      <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
        <TouchableOpacity style={[styles.halveButton]} onPress={() => navigation.navigate('ProfileScreen')}>
          <Text style={[stylesFile.buttonTitle]}>Profiel</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.halveButton]} onPress={() => navigation.navigate('ConditionScreen')}>
          <Text style={[stylesFile.buttonTitle]}>Voorwaarden</Text>
        </TouchableOpacity>
      </View>
      <View style={{justifyContent: 'space-evenly'}}>
        <TouchableOpacity style={[styles.button]} onPress={() => navigation.navigate('ListScreen')}>
          <Text style={[stylesFile.buttonTitle]}>Alle Donaties</Text>
        </TouchableOpacity>
      </View>
      <StatusBar style="auto" />
    </View>
  )
}

const styles = StyleSheet.create({
  button: {
    width: Dimensions.get('screen').width - 20,
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 10,
    borderColor: 'black',
    backgroundColor: '#FA9248',
    borderWidth: 2,
    borderRadius: 5,
    marginVertical: 10,
  },
  halveButton : {
    width: Dimensions.get('screen').width / 2 - 20,
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 10,
    borderColor: 'black',
    backgroundColor: '#FA9248',
    borderWidth: 2,
    borderRadius: 5,
    marginVertical: 10,
  },
  titleContainer: {
    alignItems: 'center', 
    justifyContent: 'center',
    height: Dimensions.get('screen').height / 5,
  }
});