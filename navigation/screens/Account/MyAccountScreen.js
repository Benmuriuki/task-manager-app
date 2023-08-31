import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  Pressable,
  Alert,
  Image,
  ScrollView,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { doc, updateDoc, getDoc } from 'firebase/firestore';
import { auth, db, storage } from '../Aunth/firebase';
import { ref, uploadBytes } from 'firebase/storage';
import * as ImagePicker from 'expo-image-picker';
//import AsyncStorage from '@react-native-async-storage/async-storage';
const MyAccountScreen = () => {
  const navigation = useNavigation();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [profilePicture, setProfilePicture] = useState(null);
  //const storageBaseUrl = 'gs://chama-b902f.appspot.com/profilePictures/xxEzH60OlSVd78jfBNBcWS5Ei7l2';

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const user = auth.currentUser;
        const uid = user.uid;

        const userDocRef = doc(db, 'users', uid);
        const userDocSnapshot = await getDoc(userDocRef);

        if (userDocSnapshot.exists()) {
          const userData = userDocSnapshot.data();
          setName(userData.name);
          setEmail(userData.email);
          setPhone(userData.phone);
          setProfilePicture(userData.profilePicture || null);
        }
      } catch (error) {
        console.error('Error fetching user data: ', error);
      }
    };

    fetchUserData();
  }, []);

  const handleChooseProfilePicture = async () => {
    try {
      const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (permissionResult.granted === false) {
        Alert.alert(
          'Permission Required',
          'Please grant access to your photo library to choose a profile picture.'
        );
        return;
      }
  
      const pickerResult = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 1,
      });
  
      if (!pickerResult.canceled && pickerResult.assets.length > 0) {
        const selectedAsset = pickerResult.assets[0];
        setProfilePicture(selectedAsset.uri);
      }
    } catch (error) {
      console.error('Error choosing profile picture: ', error);
      Alert.alert('Error', 'Failed to choose profile picture. Please try again.', [
        { text: 'OK', onPress: () => console.log('OK Pressed') },
      ]);
    }
  };
  
  const generateDownloadURL = (storageLocation) => {
    const storageBaseUrl = 'https://firebasestorage.googleapis.com/v0/b/chama-b902f.appspot.com/o';
    const downloadUrl = `${storageBaseUrl}/${encodeURIComponent(storageLocation)}?alt=media`;

    return downloadUrl;
  };

  const handleUpdate = async () => {
    const user = auth.currentUser;
    const uid = user.uid;

    const userDocRef = doc(db, 'users', uid);

    try {
      if (profilePicture) {
        try {
          // Upload the profile picture to Firebase Storage
          const response = await fetch(profilePicture);
          const blob = await response.blob();

          const storageRef = ref(storage, `profilePictures/${uid}`);
          await uploadBytes(storageRef, blob);

          // Construct the download URL manually
          const newProfilePictureUrl = generateDownloadURL(`profilePictures/${uid}`);

          // Update the user document with the new profile picture URL
          await updateDoc(userDocRef, {
            name,
            email,
            phone,
            profilePicture: newProfilePictureUrl,
          });

          setProfilePicture(newProfilePictureUrl); // Update the state with the new profile picture URL
        } catch (error) {
          console.error('Error updating profile picture:', error);
          // Handle the error, show an alert, etc.
        }
      } else {
        // Update the user document without changing the profile picture URL
        await updateDoc(userDocRef, {
          name,
          email,
          phone,
        });
      }

      Alert.alert('Success', 'Your details have been updated successfully.', [
        { text: 'OK', onPress: () => navigation.goBack() },
      ]);
    } catch (error) {
      console.error('Error updating user data: ', error);
      Alert.alert('Error', 'Failed to update user details. Please try again.', [
        { text: 'OK', onPress: () => console.log('OK Pressed') },
      ]);
    }
  };

  const handleRefresh = async () => {
    // Fetch the latest user data from the database and storage
    fetchUserData();
  };
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>My Account</Text>
      <View style={styles.profilePictureContainer}>
        {profilePicture ? (
          <Image source={{ uri: profilePicture }} style={styles.profilePicture} />
        ) : (
          <Image
          source={{ uri: profilePicture }}
            style={styles.defaultProfilePicture}
          />
        )}
        <Pressable style={styles.choosePictureButton} onPress={handleChooseProfilePicture}>
          <Text style={styles.buttonText}>Choose Picture</Text>
        </Pressable>
      </View>
      <View style={styles.formContainer}>
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Name</Text>
          <TextInput
            value={name}
            onChangeText={(text) => setName(text)}
            placeholder="Enter your name"
            placeholderTextColor="black"
            editable={true}
            style={styles.input}
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Email</Text>
          <TextInput
            value={email}
            onChangeText={(text) => setEmail(text)}
            placeholder="Enter your email"
            placeholderTextColor="black"
            editable={true}
            style={styles.input}
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Phone</Text>
          <TextInput
            value={phone}
            onChangeText={(text) => setPhone(text)}
            placeholder="Enter your phone number"
            placeholderTextColor="black"
            editable={false}
            style={styles.input}
          />
        </View>
      </View>

      <Pressable onPress={handleUpdate} style={styles.button}>
        <Text style={styles.buttonText}>Update</Text>
      </Pressable>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: 'white',
    padding: 16,
    justifyContent: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 24,
    textAlign: 'center',
  },
  profilePictureContainer: {
    alignItems: 'center',
    marginBottom: 24,
  },
  profilePicture: {
    width: 150,
    height: 150,
    borderRadius: 75,
  },
  defaultProfilePicture: {
    width: 150,
    height: 150,
    borderRadius: 75,
    backgroundColor: 'lightgray',
  },
  choosePictureButton: {
    marginTop: 16,
    backgroundColor: 'blue',
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 8,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  formContainer: {
    marginBottom: 24,
  },
  inputContainer: {
    marginTop: 16,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  input: {
    borderWidth: 1,
    borderColor: 'black',
    borderRadius: 8,
    marginTop: 8,
    padding: 10,
  },
  button: {
    backgroundColor: 'blue',
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 8,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default MyAccountScreen;
