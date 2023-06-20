import Footer from './Footer';
import {
  Button,
  View,
  Alert,
  TouchableOpacity,
  Text,
  ScrollView,
} from 'react-native';
import {StyleSheet} from 'react-native';
import {useState, useEffect} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Friends = ({navigation}) => {
  const [users, setUsers] = useState([]);
  const [token, setToken] = useState('');
  const [login, setLogin] = useState(null);

  useEffect(() => {
    const fetchLogin = async () => {
      try {
        const storedLogin = await AsyncStorage.getItem('ItemConnexion');
        const parsedLogin = storedLogin ? JSON.parse(storedLogin) : null;
        // console.log('stored login: ', storedLogin);
        console.log(
          'parsed login :\nId: ' +
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
        setToken(parsedLogin?.token);
        fetchFriend(parsedLogin?.token);
      } catch (error) {
        console.log('An error occurred while retrieving the login:', error);
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
          const usersData = await response.json();
          // console.log(usersData);
          setUsers(usersData.data);
        }
      } catch (error) {
        console.log(
          "Une erreur s'est produite lors de la récupération des utilisateurs :",
          error,
        );
      }
    };
    fetchFriend();
    fetchLogin();
  }, []);

  const handleDeleteUserFriend = async recipientId => {
    try {
      const response = await fetch(
        'https://mysnapchat.epidoc.eu/user/friends',
        {
          method: 'DELETE',
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
      // console.log(response.status);
      // console.log(data);
      if (response.ok) {
        setTimeout(() => {
          navigation.replace('Friends');
        }, 150);
      }
    } catch (error) {
      console.log(
        "Une erreur s'est produite lors de la suppression d'un ami :",
        error,
      );
    }
  };

  const styles = StyleSheet.create({
    mainContainer: {
      flex: 1,
      position: 'relative',
      backgroundColor: 'transparent',
    },
    containerHeaderTitle: {
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
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
      borderColor: 'gold',
      borderWidth: 1,
      borderRadius: 10,
      marginVertical: 10,
      padding: 10,
    },
    username: {
      marginTop: 20,
    },
  });

  return (
    <View style={styles.mainContainer}>
      <View style={styles.recipientListContainer}>
        <ScrollView style={styles.recipientList}>
          <View style={styles.username}>
            <Text>{login}</Text>
          </View>
          <View style={styles.containerHeaderTitle}>
            <Text style={styles.titleList}>
              {'\n'}Listes des amis{'\n'}
            </Text>
          </View>
          {users.length > 0 &&
            users.map(user => (
              <TouchableOpacity
                key={user._id}
                onPress={() => handleDeleteUserFriend(user._id)}
                style={styles.recipientListItem}>
                <Text>{user.username}</Text>
                <Text>Supprimer l'ami</Text>
              </TouchableOpacity>
            ))}

          <Text>{'\n'}</Text>
        </ScrollView>
      </View>
      <Footer navigation={navigation} />
    </View>
  );
};
export default Friends;
