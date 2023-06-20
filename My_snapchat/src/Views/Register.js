import React, { useState } from 'react';
import { View, TextInput, Button, StyleSheet, Text } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Register = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [displayMessage, setDisplayMessage] = useState('');

  const registerUser = async () => {
    if (email === '' || password === '' || username === '') {
      setDisplayMessage("Un des champs n'a pas été rempli, veuillez vérifier que chaque champ a bien été rempli !");
      return;
    }

    try {
      const response = await fetch(
        'https://mysnapchat.epidoc.eu/user',
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            username,
            email,
            password,
          }),
        }
      );

      const data = await response.json();
      // console.log(data);
      if (data) {
        // await AsyncStorage.setItem('ItemConnexion', JSON.stringify(data));
        // console.log("ItemConnexion : ", await AsyncStorage.getItem('ItemConnexion'));
        navigation.replace('Login');
      }
    } catch (error) {
      console.log('error : ', error);
      setDisplayMessage("Une erreur s'est produite lors de l'inscription. Veuillez réessayer.");
    }
  };

  const redirectLoginPage = () => {
    navigation.navigate('Login');
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Nom d'utilisateur"
        value={username}
        onChangeText={setUsername}
      />
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
      />
      <TextInput
        style={styles.input}
        placeholder="Mot de passe"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      {displayMessage && <Text style={styles.message}>{displayMessage}</Text>}
      <View style={styles.buttonContainer}>
        <Button title="S'inscrire" onPress={registerUser} />
        <Button title="Se connecter" onPress={redirectLoginPage} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  input: {
    width: '80%',
    marginBottom: 10,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 5,
  },
  message: {
    color: 'red',
    marginBottom: 10,
    borderWidth: 1,
    padding: 5,
    textAlign: 'center',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '80%',
  },
});

export default Register;
