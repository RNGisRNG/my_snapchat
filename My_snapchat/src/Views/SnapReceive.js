import React, {useState, useEffect} from 'react';
import {
  RefreshControl,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Image,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Footer from './Footer';

const SnapReceive = ({navigation}) => {
  const [snapList, setSnapList] = useState([]);
  const [login, setLogin] = useState(null);
  const [token, setToken] = useState('');
  const [loginId, setLoginId] = useState('');
  const [refreshing, setRefreshing] = useState(false);
  const [selectedSnap, setSelectedSnap] = useState(null);

  useEffect(() => {
    fetchData();
  }, [token]);

  const fetchData = async () => {
    try {
      const storedLogin = await AsyncStorage.getItem('ItemConnexion');
      const parsedLogin = storedLogin ? JSON.parse(storedLogin) : null;
      setLoginId(parsedLogin?._id);
      setLogin(parsedLogin?.username);
      setToken(parsedLogin?.token);
      const collectedData = await fetchSnapData();
      setSnapList(collectedData);
    } catch (error) {
      console.log('An error occurred while retrieving the login:', error);
    }
  };

  const fetchSnapData = async () => {
    try {
      const snapResponse = await fetch(`https://mysnapchat.epidoc.eu/snap/`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      // console.log('token : ' + token);
      if (snapResponse.ok) {
        const snapData = await snapResponse.json();
        const collectedData = [];

        for (let i = 0; i < snapData.data.length; i++) {
          const snap = snapData.data[i];
          const userSelected = snap.from;

          const userResponse = await fetch(
            `https://mysnapchat.epidoc.eu/user/${userSelected}`,
            {
              method: 'GET',
              headers: {
                Authorization: `Bearer ${token}`,
              },
            },
          );

          if (userResponse.ok) {
            const userData = await userResponse.json();
            snap.from = userData.data.username;
            collectedData.push(snap);
          } else {
            console.log('Failed to fetch user:', userResponse.status);
          }
        }

        setSnapList(collectedData);
        return collectedData;
      } 
    } catch (error) {
      console.log('An error occurred while fetching snap data:', error);
    }
  };

  const handlePrintSnap = async snapID => {
    try {
      const fetchSnap = await fetch(
        `https://mysnapchat.epidoc.eu/snap/${snapID}`,
        {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (fetchSnap.ok) {
        const dataSnap = await fetchSnap.json();
        setSelectedSnap(dataSnap.data);

        setTimeout(async () => {
          setSelectedSnap(null);
          await handleDeleteSnap(snapID);
        }, dataSnap.data.duration * 1000);
      }
    } catch (error) {
      console.log('Error:', error);
    }
  };

  const handleDeleteSnap = async snapID => {
    try {
      const response = await fetch(
        `https://mysnapchat.epidoc.eu/snap/seen/${snapID}`,
        {
          method: 'PUT',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      // console.log(response.status);
      await fetchData();
    } catch (error) {
      console.log('Error while deleting snap:', error);
    }
  };

  const onRefresh = React.useCallback(async () => {
    setRefreshing(true);

    try {
      await fetchData();
    } catch (error) {
      console.log('An error occurred while fetching data:', error);
    }

    setRefreshing(false);
  }, [token]);

  const handleDeconnection = () => {
    setTimeout(async () => {
      await AsyncStorage.clear();
      navigation.replace('Login');
    }, 1000);
  };

  return (
    <View style={styles.mainContainer}>
      <View style={styles.recipientListContainer}>
        <ScrollView
          style={styles.recipientList}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }>
          <View style={styles.username}>
            <Text>{login}</Text>
            <TouchableOpacity
              onPress={handleDeconnection}
              style={styles.btnDeco}>
              <Text>Déconnexion</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.containerHeaderTitle}>
            <Text style={styles.titleList}>
              {'\n'}Liste des snaps reçus{'\n'}
            </Text>
          </View>
          {snapList &&
            snapList.map(snap => (
              <TouchableOpacity
                key={snap._id}
                onPress={() => handlePrintSnap(snap._id)}
                style={styles.recipientListItem}>
                <Text>{snap.from}</Text>
                <Text>Voir le snap</Text>
              </TouchableOpacity>
            ))}

          <Text>{'\n'}</Text>
        </ScrollView>
      </View>
      {selectedSnap && (
        <View style={styles.selectedSnapContainer}>
          <Image source={{uri: selectedSnap.image}} style={styles.snapImage} />
          <Text style={styles.snapDuration}>{selectedSnap.duration}</Text>
        </View>
      )}
      <Footer navigation={navigation} />
    </View>
  );
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
    marginTop: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  btnDeco: {
    backgroundColor: 'red',
    padding: 5,
    borderRadius: 5,
  },
  titleList: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  selectedSnapContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
  },
  snapImage: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    marginBottom: 10,
  },
  snapDuration: {
    position: 'absolute',
    top: 10,
    right: 40,
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
  },
});

export default SnapReceive;
