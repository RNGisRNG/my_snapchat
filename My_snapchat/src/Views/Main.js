import React, {useState, useEffect, useRef} from 'react';
import {RNCamera} from 'react-native-camera';
import {
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Footer from './Footer';

const MainPage = ({navigation}) => {
  const cameraRef = useRef(null);
  const [login, setLogin] = useState(null);
  const [cameraType, setCameraType] = useState(RNCamera.Constants.Type.back);
  const [capturedImage, setCapturedImage] = useState(null);
  const [users, setUsers] = useState([]);
  const [token, setToken] = useState('');
  const [selectedRecipient, setSelectedRecipient] = useState(null);
  const [showRecipientList, setShowRecipientList] = useState(false);

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
        setToken(parsedLogin?.token);
        fetchUsers(parsedLogin?.token);
      } catch (error) {
        console.log('An error occurred while retrieving the login:', error);
      }
    };

    const fetchUsers = async token_ => {
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

    fetchLogin();
  }, []);

  const takePicture = async () => {
    if (cameraRef.current) {
      const options = {quality: 0.5, base64: true};
      const data = await cameraRef.current.takePictureAsync(options);
      setCapturedImage(data.base64);
      // console.log(Object.keys(data));
    }
  };

  const handleRecipientSelection = async recipientId => {
    setSelectedRecipient(recipientId);
    const duration = 5;
    const correctBaseAPiImageEncoded = 'data:image/jpg;base64,' + capturedImage;
    // console.log(
    //   '(Before fetch)\n\nTo : ' +
    //     recipientId +
    //     '\ntype : ' +
    //     typeof recipientId +
    //     '\n\nImage : ' +
    //     capturedImage +
    //     '\ntype : ' +
    //     typeof capturedImage +
    //     '\n\ncapturedImage : ' +
    //     capturedImage,
    // );
    try {
      const response = await fetch(
        'https://mysnapchat.epidoc.eu/snap',
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            to: recipientId,
            image: correctBaseAPiImageEncoded,
            duration: duration,
          }),
        },
      );
      const data = await response.json();
      // console.log(
      //   '(After fetch)' +
      //     '\n\nTo : ' +
      //     recipientId +
      //     '\ntype : ' +
      //     typeof recipientId +
      //     '\n\nImage : ' +
      //     capturedImage +
      //     '\ntype : ' +
      //     typeof capturedImage +
      //     '\n\nImage encoded : ' +
      //     correctBaseAPiImageEncoded +
      //     '\ntype : ' +
      //     typeof correctBaseAPiImageEncoded +
      //     '\n\nDuration : ' +
      //     duration +
      //     '\ntype : ' +
      //     typeof duration +
      //     '\n\nStatus : ' +
      //     response.status +
      //     '\n\nStatus (format string) : ' +
      //     JSON.stringify(response) +
      //     '\n\nData : ' +
      //     JSON.stringify(data),
      // );
      if (response.ok) {
        setTimeout(() => {
          setCapturedImage(null);
          setShowRecipientList(false);
        }, 300);

        console.log('status ok : ' + response.status);
      }
    } catch (error) {
      console.log("Une erreur s'est produite lors de l'envoi du snap :", error);
    }
  };

  const handleCancel = () => {
    setCapturedImage(null);
  };

  const handleCancelList = () => {
    setShowRecipientList(false);
  };

  const handleSend = () => {
    if (capturedImage) {
      setShowRecipientList(true);
    }
  };

  const styles = StyleSheet.create({
    camera: {
      flex: 1,
      position: 'relative',
      backgroundColor: 'transparent',
    },
    captureButton: {
      width: 80,
      height: 80,
      borderWidth: 5,
      borderColor: 'white',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: 'transparent',
      borderRadius: 100,
      shadowOpacity: 1,
      shadowRadius: 1,
      shadowColor: '#414685',
      shadowOffset: {
        width: 1,
        height: 5.5,
      },
    },
    captureCam: {
      position: 'absolute',
      bottom: 90,
      left: '40%',
    },
    cancelButton: {
      position: 'absolute',
      backgroundColor: 'red',
      padding: 6,
      borderWidth: 1,
      borderColor: 'red',
      borderRadius: 20,
      top: 20,
      left: 10,
    },
    sendButton: {
      position: 'absolute',
      backgroundColor: 'lightblue',
      padding: 6,
      borderWidth: 1,
      borderColor: 'lightblue',
      borderRadius: 20,
      bottom: 80,
      right: 20,
    },
    imageContainer: {
      flex: 1,
    },
    capturedImage: {
      flex: 1,
    },
    recipientListContainer: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.8)',
      alignItems: 'center',
      justifyContent: 'center',
      paddingVertical: 20,
    },
    recipientList: {
      backgroundColor: 'white',
      borderWidth: 3,
      borderColor: 'blue',
      paddingHorizontal: 20,
      width: '80%',
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
      color: 'blue',
      padding: 5,
      borderRadius: 10,
    },
    btnCancelListContainer: {
      flexDirection: 'row',
      justifyContent: 'flex-end',
      alignItems: 'center',
      marginVertical: 5,
    },
    btnCancelList: {
      color: 'white',
      backgroundColor: 'red',
      padding: 10,
      paddingHorizontal: 15,
      borderRadius: 20,
    },
    containerHeaderTitle: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginVertical: 5,
    },
  });

  return (
    <View style={styles.camera}>
      {capturedImage ? (
        <View style={styles.imageContainer}>
          <Image
            source={{uri: 'data:image/jpg;base64,' + capturedImage}}
            style={styles.capturedImage}
          />
          <TouchableOpacity onPress={handleCancel} style={styles.cancelButton}>
            <Text>Annuler</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={handleSend} style={styles.sendButton}>
            <Text>Envoyer</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <RNCamera
          ref={cameraRef}
          captureAudio={false}
          style={{flex: 1}}
          type={cameraType}
          androidCameraPermissionOptions={{
            title: 'Permission to use camera',
            message: 'We need your permission to use your camera',
            buttonPositive: 'Ok',
            buttonNegative: 'Cancel',
          }}
        />
      )}
      {!capturedImage && !showRecipientList && (
        <View style={styles.captureCam}>
          <TouchableOpacity
            onPress={takePicture}
            style={styles.captureButton}></TouchableOpacity>
        </View>
      )}

      {showRecipientList && (
        <View style={styles.recipientListContainer}>
          <ScrollView style={styles.recipientList}>
            <View style={styles.containerHeaderTitle}>
              <Text style={styles.titleList}>
                {'\n'}Sélectionnez le destinataire :{'\n'}
              </Text>
              <TouchableOpacity onPress={handleCancelList}>
                <Text style={styles.btnCancelList}>Annuler</Text>
              </TouchableOpacity>
            </View>
            {users.length > 0 &&
              users.map(user => (
                <TouchableOpacity
                  key={user._id}
                  onPress={() => handleRecipientSelection(user._id)}
                  style={styles.recipientListItem}>
                  <Text>{user.username}</Text>
                  <Text style={styles.textSend}>Envoyer</Text>
                </TouchableOpacity>
              ))}
            <Text>{'\n'}</Text>
          </ScrollView>
        </View>
      )}
      <Footer navigation={navigation} />
    </View>
  );
};

export default MainPage;
