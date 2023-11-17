import { StyleSheet, Dimensions } from 'react-native';

const styles = StyleSheet.create({
container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 10,
  },
  text : {
    fontSize: 20,
    fontWeight: 'bold',
  },
  title : {
    fontSize: 30,
    fontWeight: 'bold',
    color: '#FA9248',
  },  
  buttonTitle: {
    fontSize: 15,
    fontWeight: 'bold',
  },
  button: {
    width: Dimensions.get('window').width / 2,
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 10,
    borderColor: 'black',
    backgroundColor: '#FA9248',
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
    color: 'red',
    marginTop: -10,
    marginBottom: 10,
    marginVertical: 0,
    marginHorizontal: 5,
  },
});

export default styles;