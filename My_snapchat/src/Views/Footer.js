import {View, TouchableOpacity, Text} from 'react-native';
import {StyleSheet} from 'react-native';

const Footer = ({navigation}) => {
  const handleGetAllUsers = () => {
    navigation.replace('AllUsers');
  };

  const handleGetFriend = () => {
    navigation.replace('Friends');
  };

  const handleGetCamera = () => {
    navigation.replace('Home');
  };

  const handleGetSnap = () => {
    navigation.replace('SnapReceived');
  };

  const styles = StyleSheet.create({
    container: {
      position: 'absolute',
      bottom: 0,
      height: '8.5%',
      width: '100%',
      backgroundColor: 'white',
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
    },
    btn: {
      color: 'white',
      backgroundColor: 'lightblue',
      padding: 5,
      borderRadius: 20,
      width: 80,
      textAlign: 'center',
    },
  });

  return (
    <View style={styles.container}>
      <View style={styles.containerbtn}>
        <TouchableOpacity onPress={handleGetSnap}>
          <Text style={styles.btn}>Snap</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={handleGetFriend}>
          <Text style={styles.btn}>Amis</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={handleGetCamera}>
          <Text style={styles.btn}>Camera</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={handleGetAllUsers}>
          <Text style={styles.btn}>Ajouter</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default Footer;
