import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useState, useEffect } from 'react';
import { View, TextInput, Button, StyleSheet, Text } from 'react-native';

const LoginPage = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayMessage, setDisplayMessage] = useState(null);

  useEffect(() => {
    if (email === '' || password === '') {
      setDisplayMessage("Un des champs n'est pas rempli.");
    } else {
      setDisplayMessage(null);
    }
  }, [email, password]);

  const handleLogin = async () => {
    try {
      const response = await fetch(
        'https://mysnapchat.epidoc.eu/user',
        {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email: email,
            password: password,
          }),
        }
      );
      const data = await response.json();
      if (data && typeof data.data === 'object') {
        // console.log(data);
        AsyncStorage.setItem('ItemConnexion', JSON.stringify(data.data))
        navigation.replace('Home');
      } else {
        setDisplayMessage("Votre email ou votre mot de passe n'est pas correct.");
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  const RedirectRegisterPage = () => {
    navigation.replace('Register');
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      width: '100%',
      height: '100%',
    },
    containerInput: {
      width: '100%',
      height: '100%',
      justifyContent: 'center',
      padding: 20,
      marginTop: -50,
    },
    input: {
      backgroundColor: '#dcdcdc',
      margin: 10,
      borderWidth: 1,
      padding: 8,
    },
    containerSecondary: {
      position: 'absolute',
      bottom: 0,
      height: 60,
      width: '100%',
      textAlign: 'center',
      display: 'flex',
      flexDirection: 'row',
      paddingHorizontal: 5,
      justifyContent: 'center',
      backgroundColor: '#a9a9a9',
      alignItems: 'center',
    },
    containerbtn: {
      flex: 1,
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'space-around',
      padding: 5,
      borderRadius: 15,
    },
    message: {
      color: 'red',
      margin: 5,
      borderWidth: 1,
      padding: 5,
      textAlign: 'center',
      borderRadius: 20,
      backgroundColor: 'white'
    },
  });

  return (
    <View style={styles.container}>
      <View style={styles.containerInput}>
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
      </View>
      <View style={styles.containerSecondary}>
        <View style={styles.containerbtn}>
          <Button title="Se connecter" color="#b0c4de" onPress={handleLogin} />
          <Button
            title="S'enregistrer"
            color="#b0c4de"
            onPress={RedirectRegisterPage}
          />
        </View>
      </View>
    </View>
  );
};

export default LoginPage;
