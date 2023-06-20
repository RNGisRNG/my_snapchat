import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Footer from './Footer';

const AllUsers = ({navigation}) => {
  const [users, setUsers] = useState([]);
  const [token, setToken] = useState('');
  const [login, setLogin] = useState('');
  const [loginId, setLoginId] = useState('');
  const [addedFriends, setAddedFriends] = useState([]);

  useEffect(() => {
    const fetchLogin = async () => {
      try {
        const storedLogin = await AsyncStorage.getItem('ItemConnexion');
        const parsedLogin = storedLogin ? JSON.parse(storedLogin) : null;
        // console.log('stored login:', storedLogin);
        console.log(
          'parsed login :\n\nId: ' +
            parsedLogin._id +
            '\n\n' +
            'Email : ' +
            parsedLogin.email +
            '\n\n' +
            'Username : ' +
            parsedLogin.username +
            '\n\n' +
            'Token : ' +
            parsedLogin.token +
            '\n\n' +
            'Profil Picture : ' +
            parsedLogin.profilPicture
        );
        setLogin(parsedLogin?.username);
        setLoginId(parsedLogin?._id);
        setToken(parsedLogin?.token);
        fetchUsers(parsedLogin?.token);
        fetchFriend(parsedLogin?.token);
      } catch (error) {
        console.log('An error occurred while retrieving the login:', error);
      }
    };

    const fetchUsers = async token_ => {
      try {
        // console.log('token:', token_);
        const response = await fetch(
          'https://mysnapchat.epidoc.eu/user',
          {
            method: 'GET',
            headers: {
              Authorization: `Bearer ${token_}`,
            },
          },
        );
        if (response.ok) {
          const usersData = await response.json();
          console.log(usersData);
          setUsers(usersData.data);
        }
      } catch (error) {
        console.log('An error occurred while fetching users:', error);
      }
    };

    const fetchFriend = async token_ => {
      try {
        // console.log('token: ', token_);
        const response = await fetch(
          'https://mysnapchat.epidoc.eu/user/friends',
          {
            method: 'GET',
            headers: {
              Authorization: `Bearer ${token_}`,
            },
          },
        );
        if (response.ok) {
          const friendData = await response.json();
          setAddedFriends(friendData.data.map(friend => friend._id));
        }
      } catch (error) {
        console.log(
          "Une erreur s'est produite lors de la récupération des utilisateurs :",
          error,
        );
      }
    };

    fetchLogin();
  }, []);

  const handleAddUser = async recipientId => {
    try {
      const response = await fetch(
        'https://mysnapchat.epidoc.eu/user/friends',
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            friendId: recipientId,
          }),
        },
      );
      const data = await response.json();
      console.log(data);
      if (response.ok) {
        console.log(addedFriends);
        setAddedFriends([...addedFriends, recipientId]);
      }
    } catch (error) {
      console.log('An error occurred while adding a friend:', error);
    }
  };

  const styles = StyleSheet.create({
    mainContainer: {
      flex: 1,
      position: 'relative',
      backgroundColor: 'transparent',
    },
    recipientListContainer: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 40,
      backgroundColor: 'rgba(0, 0, 0, 0.8)',
      alignItems: 'center',
      justifyContent: 'center',
    },
    recipientList: {
      backgroundColor: 'white',
      borderWidth: 3,
      borderColor: 'blue',
      paddingHorizontal: 20,
      width: '100%',
      borderRadius: 10,
    },
    recipientListItem: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      borderColor: 'lightblue',
      borderWidth: 1,
      borderRadius: 10,
      marginVertical: 10,
      padding: 10,
    },
    textSend: {
      color: 'white',
      backgroundColor: 'green',
      padding: 5,
      borderRadius: 5,
    },
    titleList: {
      fontSize: 18,
      fontWeight: 'bold',
      marginBottom: 10,
      paddingTop: 15,
    },
  });

  return (
    <View style={styles.mainContainer}>
      <View style={styles.recipientListContainer}>
        <ScrollView style={styles.recipientList}>
          <View style={styles.containerHeaderTitle}>
            <Text style={styles.titleList}>Listes des utilisateurs</Text>
            <TouchableOpacity></TouchableOpacity>
          </View>
          {users.map(user => {
            const isFriendAdded = addedFriends.includes(user._id);
            return (
              <TouchableOpacity
                key={user._id}
                onPress={() => handleAddUser(user._id)}
                style={[
                  styles.recipientListItem,
                  isFriendAdded && {borderColor: 'gold'},
                ]}
                disabled={isFriendAdded}>
                <Text>{user.username}</Text>
                {!isFriendAdded && <Text style={styles.textSend}>Ajouter</Text>}
              </TouchableOpacity>
            );
          })}
          <Text>{'\n'}</Text>
        </ScrollView>
      </View>
      <Footer navigation={navigation} />
    </View>
  );
};

export default AllUsers;
